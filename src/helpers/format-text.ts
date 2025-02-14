const allButLettersAndNumbers: RegExp = /[^a-zA-Z0-9]/g;

function formatLettersAndNumbers(text: string): string {
  return text.replace(allButLettersAndNumbers, '');
}

const formatText = {
  formatLettersAndNumbers
};

export default formatText;
