const pool = require("./pool");


async function insertNewUsers({firstName, lastName, username, hashedPassword, membership_status}) {
    await pool.query("INSERT INTO users (full_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, $5)", [

        firstName,
        lastName,
        username,
        hashedPassword,
        membership_status ]);
}

async function getUser(username) {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    return rows[0];
}

async function getUserById(id) {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
}

async function updateUserMembership(id) {
    const active = 'active'
    const query = `
    UPDATE users
    SET membership_status = $1
    WHERE id = $2;
    `;


    const result = await pool.query(query, [active, id]);
}

async function updateUserAdmin(id) {
    const query = `
    UPDATE users
    SET admin = $1
    WHERE id = $2;
    `;


    const result = await pool.query(query, [true, id]);
}


async function getAllMessages() {
    try {
        const { rows } = await pool.query("SELECT * FROM messages");
        console.log('Messages fetched:', rows); // Ensure messages are fetched
        return rows;
    } catch (error) {
        console.error('Error fetching messages:', error); // Catch and log errors
        throw error;
    }
}

async function insertNewMessage({title, text, username, time}) {
    const query = `
    INSERT INTO messages (title, text, author, time)
    VALUES ($1, $2, $3, $4)`;

    await pool.query(query, [title, text, username, time]);
}

async function deleteMessage(id) {
    const query = `
    DELETE FROM messages
    WHERE id = $1;
    `;

    await pool.query(query, [id]);
}


module.exports = {
    insertNewUsers,
    getUser,
    getUserById,
    updateUserMembership,
    getAllMessages,
    insertNewMessage,
    deleteMessage,
    updateUserAdmin
}
