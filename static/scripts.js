


document.addEventListener('DOMContentLoaded', () => {

    let cardNewOptions = {};

    document.querySelectorAll('.card-content').forEach(card => {
        card.addEventListener('click', () => {
            
            console.log(1)
            card.classList.toggle('flip');


            const front = card.querySelector('.card-front');
            const back = card.querySelector('.card-back');
            
            if (card.classList.contains('flip')) {
                back.textContent = getNextOption(card, front.textContent, 2);
            } else {
                front.textContent = getNextOption(card, back.textContent, 2);
            }
            
        });
    });


    

    function getNextOption(card, currentOption, step) {
        const cardId = card.id;
        const options = cardNewOptions[cardId];
        let index = options.indexOf(currentOption);
        if (index === -1) return options[0];
        return options[(index + step) % options.length];
    }


    const buttons = document.querySelectorAll('.story-button');
    const stopwatchElement = document.getElementById('stopwatch');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const storyId = event.target.id; 

            sessionStorage.setItem('currentCaseId', storyId);

            
            fetch(`/get_story_data/${storyId}`)
                .then(response => response.json())
                .then(data => {
                    
                    initializeGame(data);

                    


                    document.getElementById('storyButtons').classList.add('fade-out');
                    setTimeout(() => {
                
                        document.getElementById('storyButtons').style.display = 'none';
                
                        document.getElementById('mainGame').style.display = 'block';
                
                    }, 100);


                    
                    
                    startStopwatch();

   

                })
        });
    });
    
    
    document.getElementById('beginButton').addEventListener('click', () => {
        document.getElementById('introScreen').classList.add('fade-out');
        setTimeout(() => {
    
            document.getElementById('introScreen').style.display = 'none';
    
            document.getElementById('storyButtons').style.display = 'block';
    
        }, 100); 
    });

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    let startTime;
    let areListenersAdded = false;
    let stopwatchInterval;
    const resultMessageElement = document.getElementById('resultMessage');



    function stopStopwatch() {
        clearInterval(stopwatchInterval);
    }

    function startStopwatch() {
        startTime = Date.now();
        stopwatchInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            stopwatchElement.textContent = formatTime(elapsedTime);
        }, 1000); 
    }

    function resetStopwatch() {
        stopStopwatch();
        stopwatchElement.textContent = formatTime(0); 
    }


    function initializeGame(data) {
        const times = data.times;
        const colors = data.colors;
        const cardOptions = data.card_options;
        const correctOptions = data.correct_options;
        const locationTexts = data.location_texts;
        const exampleSuspects = data.exampleSuspects;
        const indexes = ['1', '2', '3', '4', '5'];

        cardNewOptions = data.card_options;

        const images = data.images;

        let checkResultsCounter = 0;

        let currentIndex = 0;

        const timeSlider = document.getElementById('timeSlider');
        const timeDisplay = document.getElementById('timeDisplay');
        const textDescription = document.getElementById('textDescription');
        const imageScroller = document.getElementById('imageScroller');



        const cardColors = [
            
            { border: '#0d0d0d', text: '#0d0d0d' },
            { border: '#ffa042', text: '#ffa042' },
            { border: '#ffe442', text: '#ffe442' },
            { border: '#42ffe7', text: '#42ffe7' },
            { border: '#426dff', text: '#426dff' },
            { border: '#ff4275', text: '#ff4275' }
        ];

        const sidebarButton = document.getElementById('sidebarButton');
        const sidebar = document.getElementById('sidebar');

        

        

        sidebarButton.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                sidebarButton.innerHTML = '☰'; 
            } else {
                sidebar.classList.add('open');
                sidebarButton.innerHTML = '×';
            }
        });

    
        function addSuspectCards(suspectData) {
            const suspectCardsContainer = document.getElementById('suspectCards');
            suspectCardsContainer.innerHTML = ''; 
    
            suspectData.forEach((suspect, index) => {
                const card = document.createElement('div');
                card.className = 'suspect-card';

                card.style.borderColor = cardColors[index].border;
                card.style.color = cardColors[index].text;
                
                card.innerHTML = `
                    <h3>${suspect.name}</h3>
                    <p>${suspect.desc}</p>
                    <p>${suspect.back}</p>
                    <p>${suspect.likes}</p>
                `;
                suspectCardsContainer.appendChild(card);
            });

            
        }
    
        addSuspectCards(exampleSuspects);









        document.querySelectorAll('.card-content').forEach(card => {

            const front = card.querySelector('.card-front');
            const back = card.querySelector('.card-back');
            
            const cardId = card.id;
            const options = cardOptions[cardId];

            back.textContent = options[1];
            front.textContent = options[0];
        
        });




        timeSlider.addEventListener('input', () => {
            const timeIndex = timeSlider.value;
            timeDisplay.textContent = times[timeIndex];
            timeDisplay.style.color = colors[timeIndex]; 
    
    
            document.body.style.backgroundImage = `url('/static/images/backgroundreal${indexes[timeIndex]}.png')`;
    
            updateText(); 
        });
    
        document.querySelectorAll('.suspect-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    

        updateImages();
        updateText();







        
        document.getElementById('gotoResultsButton').addEventListener('click', () => {
            document.getElementById('mainGame').classList.add('fade-out');
            setTimeout(() => {
                document.getElementById('mainGame').style.display = 'none';

                document.getElementById('results').classList.remove('fade-out');
                
                document.getElementById('checkResultsButton').classList.remove('hide-button');

                document.querySelectorAll('.selector-card').forEach(card => {
                    card.classList.remove('disabled');
                });

                document.getElementById('results').style.display = 'block';
        
    
            }, 100); 
        });

    
    
        document.getElementById('checkResultsButton').addEventListener('click', checkResults);

        document.getElementById('checkResultsButton').addEventListener('click', function() {
            this.classList.add('hide-button');

            document.querySelectorAll('.selector-card').forEach(card => {
                card.classList.add('disabled');
            });

        });




        function updateText() {
            const currentLocation = images[currentIndex];
            const currentTime = times[timeSlider.value];
            const textContent = locationTexts[currentLocation] && locationTexts[currentLocation][currentTime];
            
            const textDescription = document.getElementById('textDescription');
            textDescription.textContent = textContent || 'No information available for this combination.';
        }





        function updateImages() {
            imageScroller.innerHTML = '';
            const timeIndex = timeSlider.value;
            const shadowColors = ['#111111', '#111111', '#111111', '#111111', '#111111'];
            const brightnessValues = ['1', '0.9', '0.8', '0.7', '0.6'];


            for (let i = -1; i <= 1; i++) {
                const index = (currentIndex + i + images.length) % images.length;
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');
                
                const imageItem = document.createElement('div');
                imageItem.classList.add('image-item');
                imageItem.classList.add('shadow');

                if (i === 0) {
                    imageItem.classList.add('active');
                } else {
                    imageItem.classList.add('inactive');
                }

                const img = document.createElement('img');
                img.src = `/static/images/${images[index]}`;

                img.style.boxShadow = `0 0 12px ${shadowColors[timeIndex]}`;

                if (imageItem.classList.contains('active')) {

                    img.style.filter = `grayscale(0%)`;
                } else {

                    img.style.filter = `grayscale(100%)`;

                }
                
                imageItem.appendChild(img);
                imageWrapper.appendChild(imageItem);
                imageScroller.appendChild(imageWrapper);

                imageItem.addEventListener('mouseover', () => {
                    if (!imageItem.classList.contains('active')) {

                        img.style.filter = `grayscale(0%)`;
                        img.style.transform = 'scale(1.1)';
                    }
                });

                imageItem.addEventListener('mouseout', () => {
                    if (!imageItem.classList.contains('active')) {
                        img.style.filter = `grayscale(100%)`;
                        img.style.transform = 'scale(1)';
                    }
                });

                imageItem.addEventListener('click', () => {
                    if (i === -1) {
                        currentIndex = (currentIndex - 1 + images.length) % images.length;
                    } else if (i === 1) {
                        currentIndex = (currentIndex + 1) % images.length;
                    }
                    updateImages();
                    updateText();
                });
            }
        }








        const murdererCard = document.getElementById('murdererCard');
        const weaponCard = document.getElementById('weaponCard');
        const murderMethodCard = document.getElementById('murderMethodCard');




        function checkResults() {

            const murdererCardFront = murdererCard.querySelector('.card-front');
            const murdererCardBack = murdererCard.querySelector('.card-back');

            const weaponSelectedFront = weaponCard.querySelector('.card-front');
            const weaponSelectedBack = weaponCard.querySelector('.card-back');


            const methodSelectedFront = murderMethodCard.querySelector('.card-front');
            const methodSelectedBack = murderMethodCard.querySelector('.card-back');


            let murdererSelected;
            
            if (murdererCard.classList.contains('flip')) {
                murdererSelected = murdererCardBack.textContent.trim();


            
            } else {
                murdererSelected = murdererCardFront.textContent.trim();

            }


            let weaponSelected;
            
            if (weaponCard.classList.contains('flip')) {
                weaponSelected = weaponSelectedBack.textContent.trim();

            
            } else {
                weaponSelected = weaponSelectedFront.textContent.trim();

            }


            let methodSelected;
            
            if (murderMethodCard.classList.contains('flip')) {
                methodSelected = methodSelectedBack.textContent.trim();

            
            } else {
                methodSelected = methodSelectedFront.textContent.trim();

            }
            
            console.log(correctOptions)

            const isCorrect = (
                murdererSelected === correctOptions.murdererCard &&
                weaponSelected === correctOptions.weaponCard &&
                methodSelected === correctOptions.murderMethodCard
            );
        
            const resultImage = isCorrect ? 'green-tick.png' : 'red-cross.png';
        
            flipCardWithResult(murdererCard, resultImage);
            flipCardWithResult(weaponCard, resultImage);
            flipCardWithResult(murderMethodCard, resultImage)

            checkResultsCounter++;

            if (isCorrect) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });  
                
                
                
                stopStopwatch();

                const elapsedTime = Date.now() - startTime;
                const formattedTime = formatTime(elapsedTime);


                resultMessageElement.innerHTML = `You finished in ${formattedTime}<br>It took you ${checkResultsCounter} ${checkResultsCounter === 1 ? 'try' : 'tries'}`;
                resultMessageElement.style.display = 'block';

                showFinishButton();
                document.getElementById('checkResultsButton').removeEventListener('click', checkResults);


            } else {



                document.getElementById('results').classList.add('fade-out');
                setTimeout(() => {
    
                    document.getElementById('results').style.display = 'none';
    
                    document.getElementById('mainGame').classList.remove('fade-out');
    
                    const mainGame = document.getElementById('mainGame');
                    mainGame.style.display = 'block';                
    
    
                    timeSlider.value = 0; 
                    timeDisplay.textContent = times[0];
                    timeDisplay.style.color = colors[0];
                    updateImages();
        
                }, 100); 
    
    
                
                showTryAgainMessage();


            }


        }

        function showTryAgainMessage() {
            const overlay = document.getElementById('overlay');
            
            overlay.style.display = 'flex';
            overlay.style.opacity = '1'; 
        
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none'; 
                }, 500); 
            }, 3000);
        }


        function flipCardWithResult(card, resultImage) {
            const front = card.querySelector('.card-front');
            const back = card.querySelector('.card-back');
            card.classList.toggle('flip');

            if (card.classList.contains('flip')) {
                back.innerHTML = `<img src="/static/images/${resultImage}" alt="Result">`;
            } else {
                front.innerHTML = `<img src="/static/images/${resultImage}" alt="Result">`;
            }

        }



        




    }



    function updateStoryButtons(completedCases) {
        completedCases.forEach(caseId => {
            const button = document.getElementById(caseId);
            if (button) {
                button.textContent = '(Complete)'; 
                button.disabled = true; 
                button.classList.add('completed');
            }
        });
    }
    
    

    function showFinishButton() {
        const finishButton = document.createElement('button');
        finishButton.classList.add('check-results-button');
        finishButton.textContent = 'Try a New Case';
    
        document.body.appendChild(finishButton);

        resetStopwatch();    

        
        
        finishButton.addEventListener('click', () => {

            const caseId = sessionStorage.getItem('currentCaseId');
            fetch('/complete_case', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ case_id: caseId }) 
            })
            .then(response => {
                if (response.ok) {




                    document.getElementById('results').classList.add('fade-out');
                    setTimeout(() => {
        
                        document.getElementById('results').style.display = 'none';
        
                    }, 100); 

                    document.getElementById('resultMessage').style.display = 'none';   
                    finishButton.style.display = 'none';    

 
                    
                    document.getElementById('storyButtons').classList.remove('fade-out');

                    document.getElementById('storyButtons').style.display = 'block';
                    document.getElementById('mainGame').classList.remove('fade-out');


                    return fetch('/get_completed_cases');
                } else {
                    alert('Error: Could not mark case as completed');
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.completed_cases) {
                    updateStoryButtons(data.completed_cases);
                } else {
                    console.error('No completed cases returned:', data);
                }
            })

            .catch(error => {
                console.error('Error:', error);
            });





        });
    }

    });
