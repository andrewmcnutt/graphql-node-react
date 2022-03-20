const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find() // Static method from mongoose model. You could also pass a filter. Without a filter we get all the entries in a collection.
      return events.map(event => {
        return transformEvent(event);
      })
    } catch(err) {
      throw err;
    };
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '622f3b500435805de1be46fc',
    });
    let createdEvent;

    try {
      const result = await event.save() // This is a function on the mongoose model.
      createdEvent = transformEvent(result);

      const creator = await User.findById('622f3b500435805de1be46fc');
      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);

      await creator.save();
      
      return createdEvent;
    } catch(err) {
      throw err;
    };
  },
}