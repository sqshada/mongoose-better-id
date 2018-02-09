import * as assert from 'assert';
import { createConnection, Schema } from 'mongoose';
import * as betterId from '../src';

const schema = new Schema({
  name: String,
  gender: String,
});

const connection = createConnection('mongodb://localhost/mongooseBetterId');

schema.plugin(betterId, {
  connection,
  field: '_id',
  prefix: 'person',
  suffix: {
    start: 0,
    step: 1,
    max: 100,
  },
  timestamp: {
    enable: true,
    format: 'YYMMDDHHmmssS',
  },
});

const Person = connection.model('person', schema);

before(async () => {
  await connection.dropDatabase();
});

describe('BetterId', () => {
  it('should be ok', async () => {
    const person = await Person.create({
      name: 'Misery',
      gender: 'male',
    });

    assert(person);
    console.log(person);
    assert(/^person[0-9]{16}$/.test(person!._id));
  });
});

after(async () => {
  await connection.close();
});
