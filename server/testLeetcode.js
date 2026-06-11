const axios = require('axios');

async function test() {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
          reputation
        }
        badges {
          name
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
      }
    }
  `;

  try {
    const { data } = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username: 'srinathmulugu' }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    console.log(JSON.stringify(data.data, null, 2));
  } catch(e) {
    console.error(e.message);
  }
}
test();
