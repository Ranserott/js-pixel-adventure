// Simple test to see if button click handler is attached
const handleClick = () => {
  console.log("Button clicked!");
};

document.querySelector('.next-challenge-btn').addEventListener('click', handleClick);
