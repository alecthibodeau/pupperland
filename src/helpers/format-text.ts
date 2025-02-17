const allButLettersAndNumbers: RegExp = /[^a-zA-Z0-9]/g;
const onlyNumbersAndMaximumFiveCharacters: RegExp = /^[0-9]{0,5}$/;

function isTextOnlyNumbersAndFiveCharacters(text: string): boolean {
  return onlyNumbersAndMaximumFiveCharacters.test(text);
}

function formatLettersAndNumbers(text: string): string {
  return text.replace(allButLettersAndNumbers, '');
}

const formatText = {
  isTextOnlyNumbersAndFiveCharacters,
  formatLettersAndNumbers
};

export default formatText;
