// import * as request from 'request-promise';
import client from './client';

const main = async () => {
  // console.log('First fetching conversation ID...');
  // const res = await request.post({ uri: 'http://chatflat.herokuapp.com/conversations', json: true });
  console.log(`Your conversation id: ${'Sk0RT8QDz'}`);

  client('Sk0RT8QDz');
};

main();
