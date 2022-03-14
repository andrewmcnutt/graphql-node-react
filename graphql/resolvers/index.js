const bcrypt = require("bcryptjs");

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } })
    return events.map(event => {
      return { 
        ...event._doc, 
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator), //We are referencing the user const below. This works becaue of hoisting.
      };
    })
  } catch(err) {
    throw err;
  };
}

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return { 
      ...user._doc, 
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    }
  } catch(err) {
    throw err;
  };
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find() // Static method from mongoose model. You could also pass a filter. Without a filter we get all the entries in a collection.
      return events.map(event => {
        return { 
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator) //Pointing to the constant that takes a userId. When we point to a function GraphQL evaluates the function. Otherwise it would only be the ObjectId. If the ObjectId auto evaluates and drilled down we would get inifinite loops. 
        };
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
      createdEvent = { 
        ...result._doc, 
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      }

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
  createUser: async args => {
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email
      })

      if (existingUser) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      
      const result = await user.save();
      
      return {...result._doc, password: null, _id: result.id }
    } catch(err) {
      throw err;
    };
  }
}