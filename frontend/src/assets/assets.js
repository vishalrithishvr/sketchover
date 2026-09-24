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
import animeSaitama from './posters/anime-saitama-one-punch.jpg'

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
import motivateLearnEarn from './posters/motivate-learn-earn.jpg'

import gamingCodZombies from './posters/gaming-cod-zombies.jpg'

import sportsDhoniWhistle from './posters/sports-dhoni-whistle.jpg'
import gamingGtaVi from './posters/gaming-gta-vi.jpg'
import movieMaster from './posters/movie-master.jpg'
import heroSpiderverseLove from './posters/hero-spiderverse-love.jpg'
import animeItachi from './posters/anime-itachi.jpg'
import heroThanos from './posters/hero-thanos.jpg'
import musicHiphopLegends from './posters/music-hiphop-legends.jpg'
import movieLeoBadass from './posters/movie-leo-badass.jpg'

// Brand artwork (banners + category tiles) supplied by the studio.
import bannerHero from './brand/banner-hero.jpg'
import bannerCombos from './brand/banner-combos.jpg'
import bannerThala from './brand/banner-thala.jpg'
import catCars from './brand/cat-cars.jpg'
import catAnime from './brand/cat-anime.jpg'
import catSports from './brand/cat-sports.jpg'
import catMovies from './brand/cat-movies.jpg'
import catMusic from './brand/cat-music.jpg'
import catGaming from './brand/cat-gaming.jpg'
import catGym from './brand/cat-gym.jpg'
import catPersonalized from './brand/cat-personalized.jpg'

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

// Categories, each using the studio's own tile artwork (the label is baked into the art).
export const categoryShowcase = [
    { category: 'Autosport',   image: catCars },
    { category: 'Anime',       image: catAnime },
    { category: 'Sports',      image: catSports },
    { category: 'TV Series',   image: catMovies },
    { category: 'Music',       image: catMusic },
    { category: 'Video-Games', image: catGaming },
    { category: 'Motivate',    image: catGym },
    { category: 'Custom',      image: catPersonalized, custom: true },
]

// Studio promo banners.
export const banners = {
    hero: bannerHero,
    combos: bannerCombos,
    thala: bannerThala,
}

// Poster collage used as a fallback backdrop.
export const bannerPosters = [
    sportsDhoniCsk,
    heroSpidermanCloseup,
    moviePeakyBlinders,
    animeOnepieceGear5,
    musicTheWeeknd,
    carBmwM2Drift,
]

// Every size carries its own price, uniform across the catalogue (real print-on-demand
// pricing), from smallest to biggest. "Split" (multi-panel) products charge this per panel.
export const SIZES = ['A6', 'A5', 'A4', 'A3', 'A3+']

export const SIZE_PRICING = {
    A6:    { price: 79,  originalPrice: 119 },
    A5:    { price: 129, originalPrice: 179 },
    A4:    { price: 89,  originalPrice: 129 },
    A3:    { price: 100, originalPrice: 149 },
    'A3+': { price: 149, originalPrice: 219 },
}

const SPLIT_PANEL_COUNT = 3

export const getSizePrice = (size, subCategory) => {
    const base = SIZE_PRICING[size] || SIZE_PRICING.A4
    const multiplier = subCategory === 'Split' ? SPLIT_PANEL_COUNT : 1
    return {
        price: base.price * multiplier,
        originalPrice: base.originalPrice * multiplier,
    }
}

// Custom posters are offered in two sizes only.
export const CUSTOM_SIZES = ['A4', 'A3']
const CUSTOM_SIZES_PRICING = { A4: SIZE_PRICING.A4, A3: SIZE_PRICING.A3 }

// Size selected by default on product pages, and the size catalogue prices refer to.
export const DEFAULT_SIZE = 'A4'

export const MIN_ORDER_VALUE = 499

// Every poster's name is shown with its Single/Split type wherever it's displayed.
export const formatProductName = (product) =>
    product.isCustom ? product.name : `${product.name} (${product.subCategory})`

const posterSizes = SIZES

export const products = [
    // ---------------- Autosport ----------------
    {
        _id: 'sk001',
        name: 'BMW M2 Drift Poster',
        description: 'A high-energy illustration of a BMW M2 mid-drift through a wall of smoke. Bold motorsport colourway, perfect for a garage or gaming setup.',
        price: 89,
        originalPrice: 129,
        image: [carBmwM2Drift],
        category: 'Autosport',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000001,
        bestseller: true
    },
    {
        _id: 'sk002',
        name: 'Porsche 911 GT3 Poster',
        description: 'Clean, editorial-style print of the Porsche 911 GT3 with bold 911 typography. A minimal statement piece for car enthusiasts.',
        price: 89,
        originalPrice: 129,
        image: [carPorsche911Gt3],
        category: 'Autosport',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000002,
        bestseller: false
    },
    {
        _id: 'sk003',
        name: 'Mercedes-AMG GT Poster',
        description: 'The AMG GT tearing through golden dust in full race livery. Dramatic lighting and motion for a bold wall feature.',
        price: 89,
        originalPrice: 129,
        image: [carAmgGt],
        category: 'Autosport',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000003,
        bestseller: false
    },
    {
        _id: 'sk004',
        name: 'Ford Mustang GT350R Poster',
        description: 'Street-art inspired Mustang GT350R print with graffiti-style lettering over a desert backdrop. Muscle car energy for any room.',
        price: 89,
        originalPrice: 129,
        image: [carMustangGt350r],
        category: 'Autosport',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000004,
        bestseller: false
    },
    {
        _id: 'sk005',
        name: 'Mustang Mach 1 1969 Poster',
        description: 'A tribute to the classic 1969-1970 Ford Mustang Mach 1, complete with spec notes and moody monochrome styling.',
        price: 89,
        originalPrice: 129,
        image: [carMustangMach1],
        category: 'Autosport',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000005,
        bestseller: false
    },
    {
        _id: 'sk006',
        name: 'MotoGP Racing Poster',
        description: 'A Yamaha MotoGP rider leaned hard into a corner, captured mid-race. High-octane print for bike lovers.',
        price: 89,
        originalPrice: 129,
        image: [bikeMotogpYamaha],
        category: 'Autosport',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000006,
        bestseller: false
    },

    // ---------------- TV Series (movies, superheroes & shows) ----------------
    {
        _id: 'sk007',
        name: 'Spider-Man Close-Up Poster',
        description: 'A hyper-detailed close-up of the Spider-Man mask, dripping with rain and lit by neon city light.',
        price: 89,
        originalPrice: 129,
        image: [heroSpidermanCloseup],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000007,
        bestseller: true
    },
    {
        _id: 'sk008',
        name: 'The Avengers Poster',
        description: '"Earth\'s Mightiest Heroes" reimagined as a striking silhouette "A" formed by the team. A modern take on a classic ensemble poster.',
        price: 89,
        originalPrice: 129,
        image: [heroAvengers],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000008,
        bestseller: true
    },
    {
        _id: 'sk009',
        name: 'Iron Man Poster',
        description: '"Heroes aren\'t born, they\'re built." A comic-inspired Iron Man print split between armor and man.',
        price: 89,
        originalPrice: 129,
        image: [heroIronman],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000009,
        bestseller: false
    },
    {
        _id: 'sk010',
        name: 'Venom Poster',
        description: 'A menacing close-up portrait of Venom, all teeth and shadow. Dark, moody, and unmissable on a wall.',
        price: 89,
        originalPrice: 129,
        image: [heroVenom],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000010,
        bestseller: false
    },
    {
        _id: 'sk011',
        name: 'Batman "I Am Vengeance" Poster',
        description: 'A blood-red, brooding portrait of The Batman with his iconic line etched across the mask.',
        price: 89,
        originalPrice: 129,
        image: [heroBatmanVengeance],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000011,
        bestseller: false
    },
    {
        _id: 'sk012',
        name: 'DC Logo Poster',
        description: 'The iconic DC emblem filled with Gotham\'s Dark Knight artwork. Clean and bold for any DC fan.',
        price: 89,
        originalPrice: 129,
        image: [heroDcLogo],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000012,
        bestseller: false
    },
    {
        _id: 'sk013',
        name: 'Spider-Man Mask Poster',
        description: 'A striking half-tone style Spider-Man mask print in bold red, black and white.',
        price: 89,
        originalPrice: 129,
        image: [heroSpidermanMask],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000013,
        bestseller: false
    },
    {
        _id: 'sk014',
        name: 'Black Panther Poster',
        description: 'A woodcut-style Black Panther illustration with Wakandan pattern detailing. Striking two-tone artwork.',
        price: 89,
        originalPrice: 129,
        image: [heroBlackPanther],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000014,
        bestseller: false
    },
    {
        _id: 'sk015',
        name: 'Avengers Infinity Saga Poster Set',
        description: 'A 3-panel "INFINITY" set spanning the Avengers roster and Thanos. Ships as a matching set of three prints.',
        price: 267,
        originalPrice: 387,
        image: [heroAvengersInfinitySet],
        category: 'TV Series',
        subCategory: 'Split',
        sizes: posterSizes,
        date: 1735000000015,
        bestseller: false
    },
    {
        _id: 'sk021',
        name: 'The Wolf of Wall Street Poster',
        description: 'Minimal pop-art style print inspired by the Scorsese classic, in bold yellow and black.',
        price: 89,
        originalPrice: 129,
        image: [movieWolfOfWallstreet],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000021,
        bestseller: false
    },
    {
        _id: 'sk022',
        name: 'Fight Club Poster',
        description: 'A moody neon-pink alternate poster capturing the film\'s rebellious energy.',
        price: 89,
        originalPrice: 129,
        image: [movieFightClub],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000022,
        bestseller: false
    },
    {
        _id: 'sk023',
        name: 'Peaky Blinders Poster',
        description: 'A sharp, painted portrait of Thomas Shelby in full Peaky Blinders attire against a crimson backdrop.',
        price: 89,
        originalPrice: 129,
        image: [moviePeakyBlinders],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000023,
        bestseller: false
    },
    {
        _id: 'sk024',
        name: 'Godzilla: King of the Monsters Poster',
        description: 'Godzilla roars against a blood-red sky in this bold, comic-inspired illustrated print.',
        price: 89,
        originalPrice: 129,
        image: [movieGodzilla],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000024,
        bestseller: true
    },

    // ---------------- Anime ----------------
    {
        _id: 'sk016',
        name: 'One Piece Jolly Roger Poster',
        description: 'The Straw Hat Jolly Roger framed inside a ship\'s helm against an open ocean sky.',
        price: 89,
        originalPrice: 129,
        image: [animeOnepieceJollyroger],
        category: 'Anime',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000016,
        bestseller: true
    },
    {
        _id: 'sk017',
        name: 'One Piece Luffy Portrait Poster',
        description: 'A painterly portrait of Monkey D. Luffy against a burst of colour. Gallery-style anime art.',
        price: 89,
        originalPrice: 129,
        image: [animeOnepieceLuffyPortrait],
        category: 'Anime',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000017,
        bestseller: false
    },
    {
        _id: 'sk018',
        name: 'One Piece Gear 5 Luffy Poster',
        description: 'Luffy unleashes Gear 5 in a swirl of fire and lightning, with the character\'s name rendered in Japanese.',
        price: 89,
        originalPrice: 129,
        image: [animeOnepieceGear5],
        category: 'Anime',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000018,
        bestseller: true
    },
    {
        _id: 'sk019',
        name: 'One Piece Wano Arc Poster',
        description: 'Gear 5 Luffy and Kaido\'s dragon form clash in this vivid Wano-arc inspired illustration.',
        price: 89,
        originalPrice: 129,
        image: [animeOnepieceWano],
        category: 'Anime',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000019,
        bestseller: false
    },
    {
        _id: 'sk020',
        name: 'One Piece Straw Hat Crew Poster Set',
        description: 'The full Straw Hat crew in a vibrant celebration scene, printed as a matching 3-panel set.',
        price: 267,
        originalPrice: 387,
        image: [animeOnepieceCrewSet],
        category: 'Anime',
        subCategory: 'Split',
        sizes: posterSizes,
        date: 1735000000020,
        bestseller: false
    },
    {
        _id: 'sk032',
        name: 'Saitama Manga Panel Poster',
        description: 'One Punch Man\'s Saitama rendered over a black-and-white manga panel collage.',
        price: 89,
        originalPrice: 129,
        image: [animeSaitama],
        category: 'Anime',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000032,
        bestseller: false
    },

    // ---------------- Music ----------------
    {
        _id: 'sk025',
        name: 'Eminem Poster',
        description: 'A bold pop-art style Eminem portrait in signature red, cream and navy tones.',
        price: 89,
        originalPrice: 129,
        image: [musicEminem],
        category: 'Music',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000025,
        bestseller: false
    },
    {
        _id: 'sk026',
        name: 'The Weeknd - Starboy Poster',
        description: 'A moody, neon-lit portrait poster inspired by The Weeknd\'s Starboy era.',
        price: 89,
        originalPrice: 129,
        image: [musicTheWeeknd],
        category: 'Music',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000026,
        bestseller: true
    },
    {
        _id: 'sk027',
        name: 'Travis Scott Poster',
        description: 'A striking black-and-white Travis Scott portrait with electric lightning detailing.',
        price: 89,
        originalPrice: 129,
        image: [musicTravisScott],
        category: 'Music',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000027,
        bestseller: false
    },
    {
        _id: 'sk028',
        name: 'Bob Marley Poster',
        description: 'A soulful monochrome Bob Marley portrait set against a Rasta-toned gradient background.',
        price: 89,
        originalPrice: 129,
        image: [musicBobMarley],
        category: 'Music',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000028,
        bestseller: false
    },

    // ---------------- Sports ----------------
    {
        _id: 'sk029',
        name: 'Messi Argentina Poster',
        description: 'A clean jersey-style tribute poster for Lionel Messi and Argentina\'s No. 10.',
        price: 89,
        originalPrice: 129,
        image: [sportsMessi],
        category: 'Sports',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000029,
        bestseller: true
    },
    {
        _id: 'sk030',
        name: 'MS Dhoni CSK Poster',
        description: 'A vibrant Chennai Super Kings jersey-style poster celebrating MS Dhoni, #7.',
        price: 89,
        originalPrice: 129,
        image: [sportsDhoniCsk],
        category: 'Sports',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000030,
        bestseller: false
    },

    // ---------------- Video-Games ----------------
    {
        _id: 'sk033',
        name: 'COD Black Ops Zombies Poster',
        description: 'A torn-paper style Call of Duty: Black Ops Cold War Zombies key art print.',
        price: 89,
        originalPrice: 129,
        image: [gamingCodZombies],
        category: 'Video-Games',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000033,
        bestseller: false
    },

    // ---------------- Motivate ----------------
    {
        _id: 'sk031',
        name: '"Everything Will Be OK" Poster',
        description: 'Hand-lettered, gold-and-teal typography print with a simple, uplifting reminder for any room.',
        price: 89,
        originalPrice: 129,
        image: [motivationalEverythingOk],
        category: 'Motivate',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000031,
        bestseller: false
    },
    {
        _id: 'sk034',
        name: '"The More You Learn" Poster',
        description: 'Bold hand-drawn typography: "The more you learn, the more you earn." Black and white statement print.',
        price: 89,
        originalPrice: 129,
        image: [motivateLearnEarn],
        category: 'Motivate',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1735000000034,
        bestseller: false
    },

    // ---------------- Latest drop ----------------
    {
        _id: 'sk035',
        name: 'Thala Whistle Podu Poster',
        description: 'MS Dhoni lifting the helmet in front of a wall of Chennai Super Kings yellow. A tribute print for every Thala fan.',
        price: 89,
        originalPrice: 129,
        image: [sportsDhoniWhistle],
        category: 'Sports',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000001,
        bestseller: true
    },
    {
        _id: 'sk036',
        name: 'GTA VI Vice City Poster',
        description: 'Grand Theft Auto VI key art — Jason and Lucia against a neon Vice City sunset. A must for any gaming setup.',
        price: 89,
        originalPrice: 129,
        image: [gamingGtaVi],
        category: 'Video-Games',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000002,
        bestseller: true
    },
    {
        _id: 'sk037',
        name: 'Master (2021) Poster',
        description: 'Minimal card-style print for the Lokesh Kanagaraj classic, complete with cast and crew credits.',
        price: 89,
        originalPrice: 129,
        image: [movieMaster],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000003,
        bestseller: false
    },
    {
        _id: 'sk038',
        name: 'Spider-Verse #LoveForever Poster',
        description: 'Miles and Gwen watching the sunset over the city skyline. A soft, romantic take on the Spider-Verse.',
        price: 89,
        originalPrice: 129,
        image: [heroSpiderverseLove],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000004,
        bestseller: true
    },
    {
        _id: 'sk039',
        name: 'Itachi Uchiha Poster',
        description: 'Itachi on the Akatsuki throne beneath a blood-red moon. Moody, detailed anime art.',
        price: 89,
        originalPrice: 129,
        image: [animeItachi],
        category: 'Anime',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000005,
        bestseller: true
    },
    {
        _id: 'sk040',
        name: 'Thanos Kingpin Poster',
        description: 'The Mad Titan reimagined as a crowned street king, framed by the six Infinity Stones.',
        price: 89,
        originalPrice: 129,
        image: [heroThanos],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000006,
        bestseller: false
    },
    {
        _id: 'sk041',
        name: 'Hip-Hop Legends Poster',
        description: 'Dr. Dre, Snoop, Eminem, Tupac, Ice Cube and Eazy-E together in one bold vector tribute.',
        price: 89,
        originalPrice: 129,
        image: [musicHiphopLegends],
        category: 'Music',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000007,
        bestseller: true
    },
    {
        _id: 'sk042',
        name: 'Leo Badass Poster',
        description: 'A fiery, neon-lit print of Thalapathy Vijay from Leo. High-contrast colour for a statement wall.',
        price: 89,
        originalPrice: 129,
        image: [movieLeoBadass],
        category: 'TV Series',
        subCategory: 'Single',
        sizes: posterSizes,
        date: 1737000000008,
        bestseller: false
    },

    // ---------------- Custom ----------------
    // Print-your-own-artwork product: the buyer uploads the image at checkout.
    {
        _id: 'sk100',
        name: 'Customization Poster',
        description: 'Your own photo, artwork or event design printed as a poster on premium 200 GSM matte paper. Upload your image and we handle the rest.',
        price: CUSTOM_SIZES_PRICING.A4.price,
        originalPrice: CUSTOM_SIZES_PRICING.A4.originalPrice,
        image: [animeOnepieceCrewSet],
        category: 'Custom',
        subCategory: 'Single',
        sizes: CUSTOM_SIZES,
        date: 1735000000100,
        bestseller: false,
        isCustom: true
    },
]
