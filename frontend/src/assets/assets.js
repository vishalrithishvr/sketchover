import carBmwM2Drift from './posters/car-bmw-m2-drift.jpg'
import carPorsche911Gt3 from './posters/car-porsche-911-gt3.jpg'
import carAmgGt from './posters/car-amg-gt.jpg'
import carMustangGt350r from './posters/car-mustang-gt350r.jpg'
import carMustangMach1 from './posters/car-mustang-mach1.jpg'
import bikeMotogpYamaha from './posters/bike-motogp-yamaha.jpg'

import heroSpidermanCloseup from './posters/hero-spiderman-closeup.jpg'
import heroAvengers from './posters/hero-avengers.jpg'
import heroIronman from './posters/hero-ironman.jpg'
import heroVenom from './posters/hero-venom.jpg'
import heroBatmanVengeance from './posters/hero-batman-vengeance.jpg'
import heroDcLogo from './posters/hero-dc-logo.jpg'
import heroSpidermanMask from './posters/hero-spiderman-mask.jpg'
import heroBlackPanther from './posters/hero-black-panther.jpg'
import heroAvengersInfinitySet from './posters/hero-avengers-infinity-set.jpg'

import animeOnepieceJollyroger from './posters/anime-onepiece-jollyroger.jpg'
import animeOnepieceLuffyPortrait from './posters/anime-onepiece-luffy-portrait.jpg'
import animeOnepieceGear5 from './posters/anime-onepiece-gear5.jpg'
import animeOnepieceWano from './posters/anime-onepiece-wano.jpg'
import animeOnepieceCrewSet from './posters/anime-onepiece-crew-set.jpg'

import movieWolfOfWallstreet from './posters/movie-wolf-of-wallstreet.jpg'
import movieFightClub from './posters/movie-fight-club.jpg'
import moviePeakyBlinders from './posters/movie-peaky-blinders.jpg'
import movieGodzilla from './posters/movie-godzilla.jpg'

import musicEminem from './posters/music-eminem.jpg'
import musicTheWeeknd from './posters/music-the-weeknd.jpg'
import musicTravisScott from './posters/music-travis-scott.jpg'
import musicBobMarley from './posters/music-bob-marley.jpg'

import sportsMessi from './posters/sports-messi.jpg'
import sportsDhoniCsk from './posters/sports-dhoni-csk.jpg'

import motivationalEverythingOk from './posters/motivational-everything-ok.jpg'

import bin_icon from './bin_icon.png'
import exchange_icon from './exchange_icon.png'
import quality_icon from './quality_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'

export const assets = {
    exchange_icon,
    quality_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    razorpay_logo,
    stripe_logo,
    heroImage: carBmwM2Drift,
    aboutImage: heroAvengersInfinitySet,
    contactImage: animeOnepieceCrewSet,
}

export const categoryShowcase = [
    { category: 'Cars & Bikes', image: carAmgGt },
    { category: 'Superheroes', image: heroAvengers },
    { category: 'Anime', image: animeOnepieceJollyroger },
    { category: 'Movies', image: movieGodzilla },
    { category: 'Music', image: musicTheWeeknd },
    { category: 'Sports', image: sportsMessi },
]

const posterSizes = ['A4', 'A3', 'A2']

export const products = [
    // ---------------- Cars & Bikes ----------------
    {
        _id: 'sk001',
        name: 'BMW M2 Drift Poster',
        description: 'A high-energy illustration of a BMW M2 mid-drift through a wall of smoke. Bold motorsport colourway, perfect for a garage or gaming setup.',
        price: 349,
        image: [carBmwM2Drift],
        category: 'Cars & Bikes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000001,
        bestseller: true
    },
    {
        _id: 'sk002',
        name: 'Porsche 911 GT3 Poster',
        description: 'Clean, editorial-style print of the Porsche 911 GT3 with bold 911 typography. A minimal statement piece for car enthusiasts.',
        price: 349,
        image: [carPorsche911Gt3],
        category: 'Cars & Bikes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000002,
        bestseller: false
    },
    {
        _id: 'sk003',
        name: 'Mercedes-AMG GT Poster',
        description: 'The AMG GT tearing through golden dust in full race livery. Dramatic lighting and motion for a bold wall feature.',
        price: 349,
        image: [carAmgGt],
        category: 'Cars & Bikes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000003,
        bestseller: false
    },
    {
        _id: 'sk004',
        name: 'Ford Mustang GT350R Poster',
        description: 'Street-art inspired Mustang GT350R print with graffiti-style lettering over a desert backdrop. Muscle car energy for any room.',
        price: 349,
        image: [carMustangGt350r],
        category: 'Cars & Bikes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000004,
        bestseller: false
    },
    {
        _id: 'sk005',
        name: 'Mustang Mach 1 1969 Poster',
        description: 'A tribute to the classic 1969-1970 Ford Mustang Mach 1, complete with spec notes and moody monochrome styling.',
        price: 349,
        image: [carMustangMach1],
        category: 'Cars & Bikes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000005,
        bestseller: false
    },
    {
        _id: 'sk006',
        name: 'MotoGP Racing Poster',
        description: 'A Yamaha MotoGP rider leaned hard into a corner, captured mid-race. High-octane print for bike lovers.',
        price: 349,
        image: [bikeMotogpYamaha],
        category: 'Cars & Bikes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000006,
        bestseller: false
    },

    // ---------------- Superheroes ----------------
    {
        _id: 'sk007',
        name: 'Spider-Man Close-Up Poster',
        description: 'A hyper-detailed close-up of the Spider-Man mask, dripping with rain and lit by neon city light.',
        price: 349,
        image: [heroSpidermanCloseup],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000007,
        bestseller: true
    },
    {
        _id: 'sk008',
        name: 'The Avengers Poster',
        description: '"Earth\'s Mightiest Heroes" reimagined as a striking silhouette "A" formed by the team. A modern take on a classic ensemble poster.',
        price: 349,
        image: [heroAvengers],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000008,
        bestseller: true
    },
    {
        _id: 'sk009',
        name: 'Iron Man Poster',
        description: '"Heroes aren\'t born, they\'re built." A comic-inspired Iron Man print split between armor and man.',
        price: 349,
        image: [heroIronman],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000009,
        bestseller: false
    },
    {
        _id: 'sk010',
        name: 'Venom Poster',
        description: 'A menacing close-up portrait of Venom, all teeth and shadow. Dark, moody, and unmissable on a wall.',
        price: 349,
        image: [heroVenom],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000010,
        bestseller: false
    },
    {
        _id: 'sk011',
        name: 'Batman "I Am Vengeance" Poster',
        description: 'A blood-red, brooding portrait of The Batman with his iconic line etched across the mask.',
        price: 349,
        image: [heroBatmanVengeance],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000011,
        bestseller: false
    },
    {
        _id: 'sk012',
        name: 'DC Logo Poster',
        description: 'The iconic DC emblem filled with Gotham\'s Dark Knight artwork. Clean and bold for any DC fan.',
        price: 349,
        image: [heroDcLogo],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000012,
        bestseller: false
    },
    {
        _id: 'sk013',
        name: 'Spider-Man Mask Poster',
        description: 'A striking half-tone style Spider-Man mask print in bold red, black and white.',
        price: 349,
        image: [heroSpidermanMask],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000013,
        bestseller: false
    },
    {
        _id: 'sk014',
        name: 'Black Panther Poster',
        description: 'A woodcut-style Black Panther illustration with Wakandan pattern detailing. Striking two-tone artwork.',
        price: 349,
        image: [heroBlackPanther],
        category: 'Superheroes',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000014,
        bestseller: false
    },
    {
        _id: 'sk015',
        name: 'Avengers Infinity Saga Poster Set',
        description: 'A 3-panel "INFINITY" set spanning the Avengers roster and Thanos. Ships as a matching set of three prints.',
        price: 899,
        image: [heroAvengersInfinitySet],
        category: 'Superheroes',
        subCategory: 'Poster Set',
        sizes: posterSizes,
        date: 1735000000015,
        bestseller: false
    },

    // ---------------- Anime ----------------
    {
        _id: 'sk016',
        name: 'One Piece Jolly Roger Poster',
        description: 'The Straw Hat Jolly Roger framed inside a ship\'s helm against an open ocean sky.',
        price: 349,
        image: [animeOnepieceJollyroger],
        category: 'Anime',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000016,
        bestseller: true
    },
    {
        _id: 'sk017',
        name: 'One Piece Luffy Portrait Poster',
        description: 'A painterly portrait of Monkey D. Luffy against a burst of colour. Gallery-style anime art.',
        price: 349,
        image: [animeOnepieceLuffyPortrait],
        category: 'Anime',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000017,
        bestseller: false
    },
    {
        _id: 'sk018',
        name: 'One Piece Gear 5 Luffy Poster',
        description: 'Luffy unleashes Gear 5 in a swirl of fire and lightning, with the character\'s name rendered in Japanese.',
        price: 349,
        image: [animeOnepieceGear5],
        category: 'Anime',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000018,
        bestseller: true
    },
    {
        _id: 'sk019',
        name: 'One Piece Wano Arc Poster',
        description: 'Gear 5 Luffy and Kaido\'s dragon form clash in this vivid Wano-arc inspired illustration.',
        price: 349,
        image: [animeOnepieceWano],
        category: 'Anime',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000019,
        bestseller: false
    },
    {
        _id: 'sk020',
        name: 'One Piece Straw Hat Crew Poster Set',
        description: 'The full Straw Hat crew in a vibrant celebration scene, printed as a matching 3-panel set.',
        price: 899,
        image: [animeOnepieceCrewSet],
        category: 'Anime',
        subCategory: 'Poster Set',
        sizes: posterSizes,
        date: 1735000000020,
        bestseller: false
    },

    // ---------------- Movies ----------------
    {
        _id: 'sk021',
        name: 'The Wolf of Wall Street Poster',
        description: 'Minimal pop-art style print inspired by the Scorsese classic, in bold yellow and black.',
        price: 349,
        image: [movieWolfOfWallstreet],
        category: 'Movies',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000021,
        bestseller: false
    },
    {
        _id: 'sk022',
        name: 'Fight Club Poster',
        description: 'A moody neon-pink alternate poster capturing the film\'s rebellious energy.',
        price: 349,
        image: [movieFightClub],
        category: 'Movies',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000022,
        bestseller: false
    },
    {
        _id: 'sk023',
        name: 'Peaky Blinders Poster',
        description: 'A sharp, painted portrait of Thomas Shelby in full Peaky Blinders attire against a crimson backdrop.',
        price: 349,
        image: [moviePeakyBlinders],
        category: 'Movies',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000023,
        bestseller: false
    },
    {
        _id: 'sk024',
        name: 'Godzilla: King of the Monsters Poster',
        description: 'Godzilla roars against a blood-red sky in this bold, comic-inspired illustrated print.',
        price: 349,
        image: [movieGodzilla],
        category: 'Movies',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000024,
        bestseller: true
    },

    // ---------------- Music ----------------
    {
        _id: 'sk025',
        name: 'Eminem Poster',
        description: 'A bold pop-art style Eminem portrait in signature red, cream and navy tones.',
        price: 349,
        image: [musicEminem],
        category: 'Music',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000025,
        bestseller: false
    },
    {
        _id: 'sk026',
        name: 'The Weeknd - Starboy Poster',
        description: 'A moody, neon-lit portrait poster inspired by The Weeknd\'s Starboy era.',
        price: 349,
        image: [musicTheWeeknd],
        category: 'Music',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000026,
        bestseller: true
    },
    {
        _id: 'sk027',
        name: 'Travis Scott Poster',
        description: 'A striking black-and-white Travis Scott portrait with electric lightning detailing.',
        price: 349,
        image: [musicTravisScott],
        category: 'Music',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000027,
        bestseller: false
    },
    {
        _id: 'sk028',
        name: 'Bob Marley Poster',
        description: 'A soulful monochrome Bob Marley portrait set against a Rasta-toned gradient background.',
        price: 349,
        image: [musicBobMarley],
        category: 'Music',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000028,
        bestseller: false
    },

    // ---------------- Sports ----------------
    {
        _id: 'sk029',
        name: 'Messi Argentina Poster',
        description: 'A clean jersey-style tribute poster for Lionel Messi and Argentina\'s No. 10.',
        price: 349,
        image: [sportsMessi],
        category: 'Sports',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000029,
        bestseller: true
    },
    {
        _id: 'sk030',
        name: 'MS Dhoni CSK Poster',
        description: 'A vibrant Chennai Super Kings jersey-style poster celebrating MS Dhoni, #7.',
        price: 349,
        image: [sportsDhoniCsk],
        category: 'Sports',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000030,
        bestseller: false
    },

    // ---------------- Motivational ----------------
    {
        _id: 'sk031',
        name: '"Everything Will Be OK" Poster',
        description: 'Hand-lettered, gold-and-teal typography print with a simple, uplifting reminder for any room.',
        price: 349,
        image: [motivationalEverythingOk],
        category: 'Motivational',
        subCategory: 'Single Poster',
        sizes: posterSizes,
        date: 1735000000031,
        bestseller: false
    },
]
