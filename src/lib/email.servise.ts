import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type SendEmailParams = {
    to: string
    subject: string
    html: string
    text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
    const from = process.env.EMAIL_FROM
    if (!from) throw new Error("Missing EMAIL_FROM env var")
    if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY env var")

    const { error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        text,
    })

    if (error) {
        throw new Error(error.message)
    }
}
