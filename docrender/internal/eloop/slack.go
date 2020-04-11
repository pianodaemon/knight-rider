package eloop

import (
	"context"
	"sync/atomic"
	"time"

	"github.com/AlexanderGrom/go-event"
	"github.com/sirupsen/logrus"
)

// You don’t want the backlog of events could grow too big
const queueSize = 20

// Represents an event occurrence
type Occurrence struct {
	// Title to identify the event occurrence
	Title string
	// Data attached to the event occurrence
	Args []interface{}
}

// The mono-thread event loop type
type SlackEventLoop struct {
	logger *logrus.Logger
	// The transacction analysis and its callbacks are
	// entirely delegated to a third party library
	// http://hestories.info/event-driven-programming-introduction-tutorial-history.html?page=2
	transCenter event.Dispatcher
	// The backlog of event occurrances
	pseudoEventQueue chan Occurrence
	// An stopper of the event loop
	quit context.CancelFunc
	// Increases the context's cancellation priority
	// when having a backlog of event occurrances
	flag uint64
}

// Instantiates a mono-thread event loop
// which is a slack implementation of the design pattern slots an signals.
// https://en.wikipedia.org/wiki/Signals_and_slots
func NewEventLoop(logger *logrus.Logger) *SlackEventLoop {

	ep := new(SlackEventLoop)

	ep.transCenter = event.New()
	ep.logger = logger
	ep.pseudoEventQueue = make(chan Occurrence, queueSize)

	return ep
}

// Starts the event loop
func (self *SlackEventLoop) TurnOn() {

	var ctx context.Context
	ctx, self.quit = context.WithCancel(context.Background())

	go func() {

		self.logger.Printf("Slack event loop is now awaiting for events")

		for {
			select {
			case <-ctx.Done():
				return

			case occurrence := <-self.pseudoEventQueue:
				startTime := time.Now()
				err := self.transCenter.Go(occurrence.Title, occurrence.Args[:]...)

				if err != nil {
					self.logger.Printf("Event (%s) error: %s", occurrence.Title, err.Error())
				}
				self.logger.Printf("Event (%s) execution time %s", occurrence.Title, time.Now().Sub(startTime).String())
				if atomic.LoadUint64(&self.flag) == 1 {
					return
				}
			}
		}
	}()
}

// Shuts down the event loop
func (self *SlackEventLoop) TurnOff() {

	atomic.StoreUint64(&self.flag, 1)
	self.quit()
}

// Ties the title of a occurence to a function handler
func (self *SlackEventLoop) Subscribe(title string, fn interface{}) error {

	return self.transCenter.On(title, fn)
}

// TryPublish tries to enqueue a occurrence to the given channel.
// Returns true if the operation was successful, and false if enqueuing
// would not have been possible without blocking.
// Occurrence is not enqueued in the latter case.
func (self *SlackEventLoop) TryPublish(occurrence *Occurrence) bool {

	select {
	case self.pseudoEventQueue <- *occurrence:
		return true
	default:
		return false
	}
}
