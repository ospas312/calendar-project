const db = require('mongoose');
const faker = require('faker');
db.connect('mongodb+srv://testing:12344321@cluster0-zwpfy.mongodb.net/calendar?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('../models/user');
const Event = require('../models/event');

function getRandomActivity() {
    let activities = ['Маникюр', 'Педикюр', 'Эпиляция', 'Пилинг', 'Брови', 'Ресницы', 'Стрижка', 'Окрашивание', 'Гинеколог', 'Чистка зубов'];
    return activities[Math.floor(Math.random() * ((activities.length - 1) - 0 + 1)) + 0];
};

async function getRandomUserId() {
    try {
        const users = await User.find({});
        const randomUserId = await users[Math.floor(Math.random() * ((users.length - 1) - 0 + 1)) + 0]._id;
        return await randomUserId;
    } catch(e) {
        console.log(e);
    }
};

async function seedBase(usersCount, eventsCount) {
    try {
        for (let i = 0; i < usersCount; i++) {
            let newUser = new User ({
                email: faker.internet.email(),
                password: faker.internet.password(),
                name: faker.name.firstName(),
                gender: 'F',
                dob: faker.date.past(),
            });
            await newUser.save()
        }

        for (let i = 0; i < eventsCount; i++) {
            let newEvent = new Event ({
                user: await getRandomUserId(),
                activity: getRandomActivity(),
                firstDate: faker.date.recent(),
                period: Math.floor(Math.random() * (30 - 1 + 1)) + 1,
                notifyBefore: Math.floor(Math.random() * (7 - 2 + 1)) + 2,
                specialist: true,
                cost: Math.floor(Math.random() * (3000 - 500 + 1)) + 500,
            });
            await newEvent.save()
        }

    } catch (e) {
        console.log(e)
    }
    await db.disconnect();
}

seedBase(5, 20);