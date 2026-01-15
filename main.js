const MoodForm = document.getElementById('moodform')
const Moodinput = document.getElementById('MoodInput')
const songsDiv = document.getElementById('songs')
const moodDetected = document.getElementById('MoodDetected')


const LASTFM_API_KEY = '17dd53fc3562a34f76c3b33e2718343e';

const MoodtoTag = {
    happy:'happy',
    sad:'sad',
    angry: 'angry',
    calm: 'calm'
}

function DetectMood(text){
        text = text.toLowerCase();
        if(text.includes('happy') || text.includes('good') || text.includes('excited')){
            return 'happy'
        }
        if(text.includes('sad') || text.includes('bad') || text.includes('down')){
            return 'sad'
        }
        if(text.includes('angry') || text.includes('mad') || text.includes('frustrated')){
            return 'angry'
        }
        return 'calm'
}

//fetch songs from lastfm
async function fetchsongs(mood){
    const tag = MoodtoTag[mood];

    const url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${tag}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
    
    const response = await fetch(url);
    const data = await response.json();

    return data.tracks.track;
}

//to display songs 
function displaySongs(tracks){
    songsDiv.innerHTML = " "
    tracks.forEach(track => {
        const songName = track.name;
        const artist = track.artist.name;

        const youtubeurl =  `https://www.youtube.com/results?search_query=${encodeURIComponent(songName + " " + artist)}`;

        const link = document.createElement("a");
        link.href = youtubeurl;
        link.target = '_blank'
        link.textContent = `${songName} - ${artist}`;

        songsDiv.appendChild(link);
        songsDiv.appendChild(document.createElement("br"));

    });
}

//to adjust the form 
MoodForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const userInput = MoodInput.value.trim();
    if(!userInput) return;

    const mood = DetectMood(userInput);
    moodDetected.textContent = `Detected Mood ${mood}`
    songsDiv.textContent = `fetching songs ....`

    try{
        const tracks = await fetchsongs(mood);
        displaySongs(tracks)
    }
    catch(error){
        songsDiv.textContent = 'something went wrong'
        console.error(error);
    }

})