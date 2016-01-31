const floor = Math;

// (Either[String, Number]) ->  Number
export const toCents = amt => {
  switch(typeof amt) {
  case 'string':
    const dollarPattern = /^(\$?)(\d+)(\.?)(\d*)$/;
    const matches = amt.trim().match(dollarPattern);
    return !matches ? 0 : parseInt(matches[2]) * 100 + (parseInt(matches[4]) || 0);
  default:
      return amt * 100;
  }
};

// (Number) -> String
export const toDollarStr = num => {
  const [ dollars, cents ] = [ Math.floor(num/100), num % 100 ];
  const pad = num => num > 9 ? num : `0${num}`;
  return `\$${dollars}.${pad(cents)}`;
};
