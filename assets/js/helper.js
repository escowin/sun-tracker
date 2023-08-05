const formattedStrings = {
  luminosity: (string) =>
    "L<span class='sub'>&#8857;</span> = 4&#960;kI<span class='sub'>&#8857;</span>A<span class='sup'>2</span>",
  pluralization: (num, string) =>
    num !== 1 ? `${num} ${string}s` : `${num} ${string}`,
  fluctuate: (num) => {
    // sets a random high low range sun temp to then randomly return a number from
    const high = num + Math.round(Math.random() * 3000);
    const low = num + Math.round((Math.random() - 0.5) * 1000); 
    const result = Math.round(low + Math.random() * (high - low));
    return result;
  },
};

module.exports = formattedStrings;
