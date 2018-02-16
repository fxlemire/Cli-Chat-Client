import * as inquirer from 'inquirer';
import * as moment from 'moment';
import * as request from 'request-promise';

const BASE_URL = 'http://chatflat.herokuapp.com/conversations/';

const chat = async (id: string) => {
  let userInput: string;
  const messageKey = 'message';

  while (userInput !== 'exit') {
    userInput = (await inquirer.prompt([
      {
        message: 'Message',
        name: messageKey,
        type: 'input',
      },
    ]))[messageKey];

    if (userInput === 'exit') {
      return;
    }

    try {
      await request.post(
        {
          uri: `${BASE_URL}${id}/messages`,
          json: true,
          body: {
            name: 'FX',
            text: userInput,
          },
        });
    } catch (err) {
      console.error(err);
    }
  }
};

const getMessages = async (id: string): Promise<any[]> => request.get({ uri: `${BASE_URL}${id}/messages`, json: true });

const printMessages = (messages: any[]) => {
  messages.forEach((message) => {
    console.log(`${message.name}: ${message.text}`);
  });
};

const spy = async (id: string) => {
  let messages = await getMessages(id);

  printMessages(messages);

  let lastMessageTimestamp = moment(messages[messages.length - 1].createdAt);

  setInterval(
    async () => {
      messages = await getMessages(id);

      const newMessages = messages.filter(m => moment(m.createdAt).isAfter(lastMessageTimestamp));

      printMessages(newMessages);

      if (newMessages.length > 0) {
        lastMessageTimestamp = moment(newMessages[newMessages.length - 1].createdAt);
      }
    },
    5000,
  );
};

const main = async (id: string) => {
  const roleChoices = {
    chat: 'Chat',
    spy: 'Spy',
  };

  const userRole = (await inquirer.prompt([
    {
      message: 'Do you want to chat or spy?',
      name: 'role',
      type: 'list',
      choices: Object.keys(roleChoices).map(k => roleChoices[k]),
    },
  ])).role;

  switch (userRole) {
    case roleChoices.chat:
      chat(id);
      break;
    case roleChoices.spy:
      spy(id);
      break;
    default:
      throw new Error('Invalid Choice');
  }
};

export default main;
