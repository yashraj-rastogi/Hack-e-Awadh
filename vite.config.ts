import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import https from 'node:https'
import { elevenLabsProxy } from './server/elevenlabsProxy.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'finbuddy-twilio-proxy',
        configureServer(server) {
          server.middlewares.use('/api/send-whatsapp', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method Not Allowed' }))
              return
            }

            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })

            req.on('end', () => {
              try {
                const payload = JSON.parse(body || '{}')
                const recipientPhone = payload.phone || ''
                const messageText = payload.message || payload.body || ''

                const sid = env.VITE_TWILIO_ACCOUNT_SID || process.env.VITE_TWILIO_ACCOUNT_SID
                const token = env.VITE_TWILIO_AUTH_TOKEN || process.env.VITE_TWILIO_AUTH_TOKEN
                const fromNumber =
                  env.VITE_TWILIO_WHATSAPP_NUMBER ||
                  process.env.VITE_TWILIO_WHATSAPP_NUMBER ||
                  '+14155238886'

                if (!sid || !token) {
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.end(
                    JSON.stringify({
                      success: false,
                      error: 'Twilio Account SID or Auth Token missing in .env configuration.',
                    })
                  )
                  return
                }

                // Format phone number to E.164 (e.g. +919876543210)
                let cleanPhone = recipientPhone.replace(/\D/g, '')
                if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
                  cleanPhone = '91' + cleanPhone
                }
                const toWhatsApp = cleanPhone.startsWith('whatsapp:')
                  ? cleanPhone
                  : `whatsapp:+${cleanPhone}`
                const fromWhatsApp = fromNumber.startsWith('whatsapp:')
                  ? fromNumber
                  : `whatsapp:${fromNumber}`

                const postData = new URLSearchParams({
                  From: fromWhatsApp,
                  To: toWhatsApp,
                  Body: messageText,
                }).toString()

                const auth = Buffer.from(`${sid}:${token}`).toString('base64')
                const twilioReq = https.request(
                  {
                    hostname: 'api.twilio.com',
                    port: 443,
                    path: `/2010-04-01/Accounts/${sid}/Messages.json`,
                    method: 'POST',
                    headers: {
                      Authorization: `Basic ${auth}`,
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Content-Length': Buffer.byteLength(postData),
                    },
                  },
                  (twilioRes) => {
                    let twilioData = ''
                    twilioRes.on('data', (chunk) => {
                      twilioData += chunk
                    })
                    twilioRes.on('end', () => {
                      res.setHeader('Content-Type', 'application/json')
                      try {
                        const json = JSON.parse(twilioData)
                        if (
                          twilioRes.statusCode &&
                          twilioRes.statusCode >= 200 &&
                          twilioRes.statusCode < 300
                        ) {
                          res.statusCode = 200
                          res.end(
                            JSON.stringify({
                              success: true,
                              messageSid: json.sid,
                              status: json.status,
                            })
                          )
                        } else {
                          const code = json.code
                          const needsJoin = code === 21608 || code === 63015
                          res.statusCode = 200
                          res.end(
                            JSON.stringify({
                              success: false,
                              error: json.message || 'Failed to send WhatsApp message.',
                              code: code,
                              needsSandboxJoin: needsJoin,
                            })
                          )
                        }
                      } catch (e) {
                        res.statusCode = 500
                        res.end(
                          JSON.stringify({
                            success: false,
                            error: 'Failed to parse Twilio response: ' + twilioData,
                          })
                        )
                      }
                    })
                  }
                )

                twilioReq.on('error', (err) => {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(
                    JSON.stringify({
                      success: false,
                      error: 'Twilio connection error: ' + err.message,
                    })
                  )
                })

                twilioReq.write(postData)
                twilioReq.end()
              } catch (parseErr) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(
                  JSON.stringify({
                    success: false,
                    error: 'Invalid JSON request payload',
                  })
                )
              }
            })
          })
        },
      },
      elevenLabsProxy({
        apiKey: env.ELEVENLABS_API_KEY,
        voiceId: env.ELEVENLABS_VOICE_ID,
        ttsModel: env.ELEVENLABS_TTS_MODEL,
      }),
    ],
  }
})
