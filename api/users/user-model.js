const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {
const rows = await db('posts as p')
.select('p.id as post_id', 'contents', 'username')
.join('users as u', 'u.id', '=', 'p.user_id')
.where('u.id',user_id)
return rows
  /*
  select
 p.id as post_id,
 contents,
 username
 from posts as p
 join users as u
 on u.id = p.user_id
 where u.id=3;
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

async function find() {
  const rows = await db('users as u')
  .leftJoin('posts as p','u.id','=','p.user_id')
  .count('p.id as post_count')
  .groupBy('u.id')
  .select('username','u.id as user_id')
  return rows
  /*
  select
u.id as user_id,
username,
count(p.id) as post_count
from users as u
left join posts as p
    on u.id = p.user_id
    group by u.id;
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  const rows = await db('users as u')
  .leftJoin('posts as p','u.id', '=', 'p.user_id')
  .select('u.id as user_id','contents','username','p.id as post_id')
  .where('u.id',id)

  let result = rows.reduce((acc, row) =>{
    if(row.contents){
      acc.posts.push(row)
    }
    return acc
  },{ user_id: rows[0].user_id, username: rows[0].username, posts:[]})
  return result
  
  /*
  select
u.id as user_id,
username,
contents,
p.id as post_id
from users as u
left join posts as p
    on u.id = p.user_id
    where u.id=3;
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
