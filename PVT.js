const startButton = document.getElementById('startButton');
const stimulus = document.getElementById('stimulus');
const startMessage = document.getElementById('startMessage');
const endMessage = document.getElementById('endMessage');
let reactionTimes = [];
let trialStartTime;
let errorCount = 0;

// Show the start message when the page loads
window.onload = () => {
    startMessage.style.display = 'block';
};

startButton.addEventListener('click', () => {
    startMessage.style.display = 'none'; // Hide the start message
    startButton.style.display = 'none'; // Hide the start button
    trialStartTime = new Date().getTime();
    scheduleNextStimulus();
});

function scheduleNextStimulus() {
    let delay = Math.random() * 2000 + 2000; // Random delay between 2-4 seconds
    setTimeout(showStimulus, delay);
}

function showStimulus() {
    if (new Date().getTime() - trialStartTime >= 60000) { // 60000 ms = 1 minute
        endTest();
        return;
    }
    stimulus.style.display = 'block'; // Show the stimulus
    stimulus.timeout = new Date().getTime();
}

stimulus.addEventListener('click', () => {
    if (stimulus.style.display === 'none') {
        errorCount++;
        return;
    }
    let reactionTime = new Date().getTime() - stimulus.timeout;
    reactionTimes.push(reactionTime);
    stimulus.style.display = 'none'; // Hide the stimulus
    scheduleNextStimulus();
});

function endTest() {
    stimulus.style.display = 'none'; // Ensure the stimulus is hidden
    endMessage.style.display = 'block'; // Show the thank you message

    setTimeout(() => {
        const averageReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
        const variance = reactionTimes.reduce((total, current) => total + Math.pow(current - averageReactionTime, 2), 0) / reactionTimes.length;
        const standardDeviation = Math.sqrt(variance);

        // Replace YOUR_QUALTRICS_SURVEY_LINK with your actual Qualtrics survey link
        const redirectUrl = `https://umich.qualtrics.com/jfe/form/SV_2sI9FL99Tctaac6?averageReactionTime=${averageReactionTime}&standardDeviation=${standardDeviation}&errors=${errorCount}`;
        window.location.href = redirectUrl; // Redirect to Qualtrics with the data
    }, 30000); // 30-second delay before redirecting
}
