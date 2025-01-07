module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY HH:mm
    return new Date(date).toLocaleString();
  },
  
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }
    return word;
  },

  is_own_post: (postUserId, userId) => {
    return postUserId === userId;
  },
  
  truncate: (str, len) => {
    if (str.length > len) {
      return str.substring(0, len) + '...';
    }
    return str;
  }
};
