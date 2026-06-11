const extractUsername = (url, platform) => {
  if (!url) return null;
  try {
    const cleanUrl = url.trim().replace(/\/$/, ''); // remove trailing slash
    let match;
    
    if (platform === 'github') {
      match = cleanUrl.match(/github\.com\/([^\/]+)/);
    } else if (platform === 'leetcode') {
      match = cleanUrl.match(/leetcode\.com\/(?:u\/)?([^\/]+)/);
    } else if (platform === 'codechef') {
      match = cleanUrl.match(/codechef\.com\/users\/([^\/]+)/);
    }
    
    return match ? match[1] : null;
  } catch (error) {
    return null;
  }
};

module.exports = extractUsername;
