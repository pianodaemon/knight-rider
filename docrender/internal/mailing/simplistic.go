package mailing

import (
	"bytes"
	"encoding/base64"
	"net/smtp"
)

// Features all the email's elements
type Email struct {
	From        string
	To          []string
	Subject     string
	Body        string
	Attachments map[string][]byte
	Send        func(string, smtp.Auth) error
}

// Define an attach handler
type Attacher func(item interface{}) (string, []byte, error)

// Email pretty constructor
func NewEmailWithAttachments(sender string, receivers []string, subject, body string, attacher Attacher, attachments ...interface{}) (*Email, error) {

	mptr := &Email{Subject: subject, Body: body}

	mptr.From = sender
	mptr.To = receivers

	mptr.Attachments = make(map[string][]byte)

	for i := 0; i < len(attachments); i++ {

		name, buff, err := attacher(attachments[i])
		if err != nil {

			return nil, err
		}

		mptr.Attachments[name] = buff
	}

	mptr.Send = func(addr string, auth smtp.Auth) error {

		return smtp.SendMail(addr, auth,
			mptr.From, mptr.To,
			mptr.turnAttachmentsIntoMIME())
	}

	return mptr, nil
}

// Vomits email as raw bytes
func (self *Email) turnAttachmentsIntoMIME() []byte {

	buf := bytes.NewBuffer(nil)

	buf.WriteString("Subject: " + self.Subject + "\n")
	buf.WriteString("MIME-Version: 1.0\n")

	boundary := "f46d043c813270fc6b04c2d223da"

	if len(self.Attachments) > 0 {

		/* These headers are just added if
		   we've got at least one minimal attachment */
		buf.WriteString("Content-Type: multipart/mixed; boundary=" + boundary + "\n")
		buf.WriteString("--" + boundary + "\n")
	}

	buf.WriteString("Content-Type: text/plain; charset=utf-8\n")
	buf.WriteString(self.Body)

	if len(self.Attachments) > 0 {

		for k, v := range self.Attachments {

			buf.WriteString("\n\n--" + boundary + "\n")
			buf.WriteString("Content-Type: application/octet-stream\n")
			buf.WriteString("Content-Transfer-Encoding: base64\n")
			buf.WriteString("Content-Disposition: attachment; filename=\"" + k + "\"\n\n")

			b := make([]byte, base64.StdEncoding.EncodedLen(len(v)))
			base64.StdEncoding.Encode(b, v)
			buf.Write(b)
			buf.WriteString("\n--" + boundary)
		}

		buf.WriteString("--")
	}

	return buf.Bytes()
}
