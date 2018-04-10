import {env} from '../utils/configure';

export default {
    logout_timer: env('GAME_LOGOUT_TIMER', 10000),
    default_stats: {
        health_max: env('GAME_DEFAULT_HEALTH', 100),
        money: env('GAME_DEFAULT_MONEY', 300),
        bank: env('GAME_DEFAULT_BANK', 0),
    },
    timers: [
        {
            name: 'autosave',
            enabled: env('GAME_TIMERS_AUTOSAVE_ENABLED', true),
            interval: env('GAME_TIMERS_AUTOSAVE_INTERVAL', 10000),
        },
        {
            name: 'newday',
            enabled: env('GAME_TIMERS_NEWDAY_ENABLED', true),
            interval: env('GAME_TIMERS_NEWDAY_INTERVAL', 1800000),
        },
    ],
    cooldowns: {
        move: env('GAME_COOLDOWNS_MOVE', 0.3),
        attack: env('GAME_COOLDOWNS_ATTACK', 2.0),
        aim: env('GAME_COOLDOWNS_AIM', 1.0),
        chat: env('GAME_COOLDOWNS_CHAT', 1.0),
        faction_invite: env('GAME_COOLDOWNS_FACTION_INVITE', 3.0),
        skill_snoop: env('GAME_COOLDOWNS_SKILL_SNOOP', 10.0),
        skill_hide: env('GAME_COOLDOWNS_SKILL_HIDE', 30.0),
        skill_search: env('GAME_COOLDOWNS_SKILL_SEARCH', 5.0),
    },
};