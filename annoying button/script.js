const button = document.getElementById('button');
const mybutton = document.getElementById('mybutton');

button.addEventListener('mouseover', () => {
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    button.style.backgroundColor = color;
    let roll = Math.floor(Math.random() * 90) + 1;
    mybutton.style.height = roll *2 + 'vh';
    let randomLeft = Math.floor(Math.random() * 90) + 1; 
    mybutton.style.position = 'absolute';
    mybutton.style.left = randomLeft + 'vw';

    console.log(`Button clicked! Random height: ${roll}px`);
});
button.addEventListener('click', (e) => {
    button.style.backgroundColor = 'black';
    button.innerHTML = 'You win!';
});