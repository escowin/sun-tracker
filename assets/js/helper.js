const formattedStrings = {
  luminosity: (string) =>
    "L<span class='sub'>&#8857;</span> = 4&#960;kI<span class='sub'>&#8857;</span>A<span class='sup'>2</span>",
  pluralization: (num, string) =>
    num !== 1 ? `${num} ${string}s` : `${num} ${string}`,
};

module.exports = formattedStrings;
