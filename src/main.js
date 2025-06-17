import '@/assets/styles.scss';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { defineCustomElements } from 'dash-button-web/loader';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import { createApp } from 'vue';
import App from './App.vue';
import { authPlugin } from './plugins/authPlugin';
import router from './router';

const DS2Preset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#c1f4ef',
            100: '#aff0ea',
            200: '#8ceae1',
            300: '#69e3d8',
            400: '#45ddce',
            500: '#22d6c5',
            600: '#1db4a5',
            700: '#179286',
            800: '#126f66',
            900: '#0c4d47',
            DEFAULT: '#126f66'
        }
    },
    components: {
        button: {
            root: {
                paddingX: '22px',
                paddingY: '8px',
                borderRadius: '4px'
            },
            colorScheme: {
                light: {
                    root: {
                        primary: {
                            background: '#126f66',
                            hoverBackground: '#1db4a5',
                            borderColor: '#126f66',
                            hoverBorderColor: '#1db4a5',
                            color: '#ffffff',
                            hoverColor: '#ffffff'
                        }
                    },
                    outlined: {
                        primary: {
                            borderColor: '#126f66',
                            hoverBorderColor: '#126f66',
                            color: '#126f66',
                            hoverColor: '#ffffff',
                            background: '#22d6c5',
                            hoverBackground: '#22d6c5'
                        }
                    }
                },
                dark: {
                    root: {
                        primary: {
                            background: '#126f66',
                            hoverBackground: '#1db4a5',
                            borderColor: '#126f66',
                            hoverBorderColor: '#1db4a5',
                            color: '#ffffff',
                            hoverColor: '#ffffff'
                        }
                    },
                    outlined: {
                        primary: {
                            borderColor: '#126f66',
                            hoverBorderColor: '#126f66',
                            color: '#126f66',
                            hoverColor: '#126f66',
                            background: 'transparent',
                            hoverBackground: 'transparent'
                        }
                    }
                }
            }
        },
        tabs: {
            tab: {
                fontWeight: '500',
                padding: '9px 16px',
                activeColor: '#126f66',
                background: 'transparent'
            },
            activeBar: {
                background: '#126f66',
                height: '2px'
            },
            tabpanel: {
                padding: '32px 0',
                background: 'transparent'
            },
            tablist: {
                background: 'transparent'
            },
            navButton: {
                background: 'transparent'
            }
        },
        datatable: {
            columnTitle: {
                fontWeight: '500'
            },
            headerCell: {
                padding: '20px 10px',
                background: '#cccccc',
                color: '#323232'
            },
            bodyCell: {
                padding: '20px 10px'
            },
            row: {
                background: 'transparent'
            },
            paginatorBottom: {
                borderWidth: '0px'
            }
        },
        select: {
            root: {
                borderColor: 'transparent',
                shadow: 'none',
                focusBorderColor: 'transparent',
                hoverBorderColor: 'transparent'
            },
            option: {}
        },
        dialog: {
            root: {
                borderRadius: '12px'
            },
            content: {
                padding: '24px 24px'
            },
            footer: {
                padding: '24px 24px'
            },
            header: {
                padding: '16px 24px'
            }
        },
        datepicker: {},
        menu: {
            root: { borderRadius: '16px' },
            list: {
                padding: '16px'
            }
        }
    }
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);
app.use(PrimeVue, {
    theme: {
        preset: DS2Preset,
        options: {
            darkModeSelector: '.fake-app-dark'
        }
    },
    ripple: true
});
app.use(ToastService);
app.use(DialogService);
app.use(ConfirmationService);

app.use(authPlugin);
defineCustomElements(window);

app.mount('#app');
