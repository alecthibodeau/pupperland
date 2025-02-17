const allButLettersAndNumbers: RegExp = /[^a-zA-Z0-9]/g;
const onlyDigits: RegExp = /^\d+$/;

function isTextOnlyDigits(text: string): boolean {
  return onlyDigits.test(text);
}

function formatLettersAndNumbers(text: string): string {
  return text.replace(allButLettersAndNumbers, '');
}

const formatText = {
  isTextOnlyDigits,
  formatLettersAndNumbers
};

export default formatText;
