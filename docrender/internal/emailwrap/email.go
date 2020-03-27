package emailwrap
// OJO: si se usa cuenta de gmail, debe encenderse el ajuste Less Secure Apps

import (
	// "fmt"
	"net/smtp"

	"github.com/jordan-wright/email"
)

// EmailData ...
type EmailData struct {
	from        string
	to          []string
	bcc         []string
	cc          []string
	subject     string
	text        []byte
	html        []byte
	attachFiles []string
}

// SMTPConnData ...
type SMTPConnData struct {
	addr     string
	username string
	passw    string
	host     string
}

// EmailError ...
type EmailError struct {
	What string
}

func (e *EmailError) Error() string {
	return e.What
}

// func main() {

// ********************************************
// USO DE github.com/jordan-wright/email, SIN UN PACKAGE QUE LO LLAME.
// ALGUNOS VALORES PUEDEN OMITIRSE (Bcc, Cc, HTML...):
// e := email.NewEmail()

// e.From = "Omar Montes <omontes.dev@gmail.com>"
// e.To = []string{"recipientTo@hotmail.com"}
// e.Bcc = []string{"recipientBcc@yahoo.com.mx"}
// e.Cc = []string{"recipientCc@yahoo.com.mx"}
// e.Subject = "Awesome Subject (from Go program)"
// e.Text = []byte("Text Body is, of course, supported!")
// e.HTML = []byte("<h1>Fancy HTML is supported, too!</h1>")

// _, err := e.AttachFile("filename1")
// if err != nil {
// 	panic(err)
// }

// _, err = e.AttachFile("filename2")
// if err != nil {
// 	panic(err)
// }

// err = e.Send("smtp.gmail.com:587", smtp.PlainAuth("", "omontes.dev@gmail.com", "mypassw", "smtp.gmail.com"))
// if err != nil {
// 	panic(err)
// }

// *********************************************
// SI SE USA ESTE PACKAGE (verificar qué ocurre al enviar zero values):
	// err := SendEmail(
	// 	EmailData{
	// 		"Omar Montes <omontes.dev@gmail.com>",
	// 		[]string{"recipientTo@hotmail.com"},
	// 		[]string{"recipientBcc@yahoo.com.mx"},
	// 		[]string{"recipientCc@yahoo.com.mx"},
	// 		"Awesome Subject (from Go program)",
	// 		[]byte("Text Body is, of course, supported!"),
	// 		[]byte("<h1>Fancy HTML is supported, too!</h1>"),
	// 		[]string{"filename1", "filename2"},
	// 	},
	// 	SMTPConnData{
	// 		"smtp.gmail.com:587",
	// 		"omontes.dev@gmail.com",
	// 		"mypassw",
	// 		"smtp.gmail.com",
	// 	},
	// )
	// if err != nil {
	// 	fmt.Println(err)
	// }

// }

// SendEmail ...
func SendEmail(emailData EmailData, smtpConnData SMTPConnData) error {

	e := email.NewEmail()
	e.From = emailData.from
	e.To = emailData.to
	e.Bcc = emailData.bcc
	e.Cc = emailData.cc
	e.Subject = emailData.subject
	e.Text = emailData.text
	e.HTML = emailData.html

	for _, filename := range emailData.attachFiles {
		_, err := e.AttachFile(filename)
		if err != nil {
			return &EmailError{"AttachFile: " + err.Error()}
		}
	}

	err := e.Send(smtpConnData.addr, smtp.PlainAuth("", smtpConnData.username, smtpConnData.passw, smtpConnData.host))
	if err != nil {
		return &EmailError{"Send: " + err.Error()}
	}

	return nil
}