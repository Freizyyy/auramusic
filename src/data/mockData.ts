export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  audioUrl: string;
  lyrics?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

export const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Моя игра',
    artist: 'Баста',
    album: 'Баста 1',
    coverUrl: 'https://picsum.photos/seed/basta/300/300',
    duration: '5:34',
    audioUrl: '/basta.mp3',
    lyrics: `Моя игра, моя игра
Она мне принадлежит и таким же как и я
Моя игра, моя игра
Здесь правила одни, и цель одна

Я начинал свою игру еще в далеком детстве
Когда не знал, что значит слово "средства"
Когда не знал, что значит слово "цель"
И не делил людей на "своих" и "чужих"

Моя игра, моя игра...`,
  },
  {
    id: '2',
    title: 'Застрахуй братуху',
    artist: 'Ноггано',
    album: 'Первый',
    coverUrl: 'https://picsum.photos/seed/noggano/300/300',
    duration: '4:20',
    audioUrl: '/noggano.mp3',
    lyrics: `Застрахуй братуху, застрахуй!
Застрахуй братуху, застрахуй!

Он говорит: "Братуха, не горюй!
Сейчас мы всё устроим, ты только не психуй!"
Мы пошли в контору, там сидит мадам
Она говорит: "Что нужно вам?"

Застрахуй братуху, застрахуй!`,
  },
  {
    id: '3',
    title: 'Табор уходит в небо',
    artist: 'Каспийский Груз',
    album: 'Сторона А / Сторона Б',
    coverUrl: 'https://picsum.photos/seed/kaspiyskiy/300/300',
    duration: '3:45',
    audioUrl: '/kaspgruz.mp3',
    lyrics: `А табор уходит в небо,
И мы за ним по пятам.
Там, где я еще не был,
Там, где нас нету, братан.

Мы делили с тобой один кусок хлеба,
А теперь табор уходит в небо...`,
  },
  {
    id: '4',
    title: 'Отмели',
    artist: 'N1NT3ND0',
    album: 'N1NT3ND0',
    coverUrl: 'https://picsum.photos/seed/nintendo/300/300',
    duration: '4:12',
    audioUrl: '/nintendo.mp3',
    lyrics: `Отмели, отмели, мы на мели
Корабли, корабли, не доплыли
Черный пистолет, черный пистолет
В этом городе для нас места нет

Криминал, криминал, я всё знал
Но всё равно в эту игру играл...`,
  },
  {
    id: '5',
    title: 'Давай, делай шире круг',
    artist: 'Ноггано feat. АК-47, 5 Плюх, Guf',
    album: 'Теплый',
    coverUrl: 'https://picsum.photos/seed/shirekrug/300/300',
    duration: '4:55',
    audioUrl: '/shirekrug.mp3',
    lyrics: `Давай, делай шире круг!
Это Ростов, Москва и Екб, мой друг.
Шире круг, шире круг!
Здесь все свои, здесь нет чужих подруг.

Гуф на микрофоне, АК-47 в здании
Ноггано на бите, мы не ищем оправдания...`,
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'p1',
    title: 'Газгольдер Классика',
    description: 'Лучшие хиты от Басты, Ноггано, QП и других резидентов.',
    coverUrl: 'https://picsum.photos/seed/gazgolder/400/400',
    tracks: mockTracks,
  },
  {
    id: 'p2',
    title: 'Пацанский цитатник',
    description: 'Каспийский Груз и правильный рэп для ровных пацанов.',
    coverUrl: 'https://picsum.photos/seed/patsany/400/400',
    tracks: [mockTracks[2], mockTracks[1], mockTracks[3]],
  },
  {
    id: 'p3',
    title: 'Русский Рэп 2010-х',
    description: 'Золотая эра русского хип-хопа.',
    coverUrl: 'https://picsum.photos/seed/rusrap/400/400',
    tracks: mockTracks,
  },
  {
    id: 'p4',
    title: 'На районе',
    description: 'Музыка для вечерних поездок по городу.',
    coverUrl: 'https://picsum.photos/seed/hood/400/400',
    tracks: [mockTracks[3], mockTracks[4], mockTracks[1]],
  },
  {
    id: 'p5',
    title: 'Лирика',
    description: 'Душевные треки со смыслом.',
    coverUrl: 'https://picsum.photos/seed/lirika/400/400',
    tracks: [mockTracks[0], mockTracks[4]],
  },
];
