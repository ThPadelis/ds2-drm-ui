<script setup>
import { useLayout } from '@/layout/composables/layout';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { ref } from 'vue';

const { layoutConfig, isDarkTheme } = useLayout();

const presets = {
    Aura,
    Lara,
    Nora
};
const preset = ref(layoutConfig.preset);
const presetOptions = ref(Object.keys(presets));

const menuMode = ref(layoutConfig.menuMode);
const menuModeOptions = ref([
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' }
]);

const primaryColors = ref([{ name: 'green', palette: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' } }]);

const surfaces = ref([
    {
        name: 'gray',
        palette: { 0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' }
    }
]);

function getPresetExt() {
    const color = primaryColors.value.find((c) => c.name === layoutConfig.primary);

    if (color.name === 'noir') {
        return {
            semantic: {
                primary: {
                    50: '{surface.50}',
                    100: '{surface.100}',
                    200: '{surface.200}',
                    300: '{surface.300}',
                    400: '{surface.400}',
                    500: '{surface.500}',
                    600: '{surface.600}',
                    700: '{surface.700}',
                    800: '{surface.800}',
                    900: '{surface.900}',
                    950: '{surface.950}'
                },
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.950}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.800}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.950}',
                            focusBackground: '{primary.700}',
                            color: '#ffffff',
                            focusColor: '#ffffff'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.50}',
                            contrastColor: '{primary.950}',
                            hoverColor: '{primary.200}',
                            activeColor: '{primary.300}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.300}',
                            color: '{primary.950}',
                            focusColor: '{primary.950}'
                        }
                    }
                }
            }
        };
    } else {
        return {
            semantic: {
                primary: color.palette,
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.500}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.600}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.100}',
                            color: '{primary.700}',
                            focusColor: '{primary.800}'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.400}',
                            contrastColor: '{surface.900}',
                            hoverColor: '{primary.300}',
                            activeColor: '{primary.200}'
                        },
                        highlight: {
                            background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                            focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                            color: 'rgba(255,255,255,.87)',
                            focusColor: 'rgba(255,255,255,.87)'
                        }
                    }
                }
            }
        };
    }
}

function updateColors(type, color) {
    if (type === 'primary') {
        layoutConfig.primary = color.name;
    } else if (type === 'surface') {
        layoutConfig.surface = color.name;
    }

    applyTheme(type, color);
}

function applyTheme(type, color) {
    if (type === 'primary') {
        updatePreset(getPresetExt());
    } else if (type === 'surface') {
        updateSurfacePalette(color.palette);
    }
}

function onPresetChange() {
    layoutConfig.preset = preset.value;
    const presetValue = presets[preset.value];
    const surfacePalette = surfaces.value.find((s) => s.name === layoutConfig.surface)?.palette;

    $t().preset(presetValue).preset(getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
}

function onMenuModeChange() {
    layoutConfig.menuMode = menuMode.value;
}
</script>

<template>
    <div
        class="config-panel hidden absolute top-[3.25rem] right-0 w-64 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]"
    >
        <div class="flex flex-col gap-4">
            <div>
                <span class="text-sm text-muted-color font-semibold">Primary</span>
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <button
                        v-for="primaryColor of primaryColors"
                        :key="primaryColor.name"
                        type="button"
                        :title="primaryColor.name"
                        @click="updateColors('primary', primaryColor)"
                        :class="['border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1', { 'outline-primary': layoutConfig.primary === primaryColor.name }]"
                        :style="{ backgroundColor: `${primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500']}` }"
                    ></button>
                </div>
            </div>
            <div>
                <span class="text-sm text-muted-color font-semibold">Surface</span>
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <button
                        v-for="surface of surfaces"
                        :key="surface.name"
                        type="button"
                        :title="surface.name"
                        @click="updateColors('surface', surface)"
                        :class="[
                            'border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1',
                            { 'outline-primary': layoutConfig.surface ? layoutConfig.surface === surface.name : isDarkTheme ? surface.name === 'zinc' : surface.name === 'slate' }
                        ]"
                        :style="{ backgroundColor: `${surface.palette['500']}` }"
                    ></button>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-sm text-muted-color font-semibold">Presets</span>
                <SelectButton v-model="preset" @change="onPresetChange" :options="presetOptions" :allowEmpty="false" />
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-sm text-muted-color font-semibold">Menu Mode</span>
                <SelectButton v-model="menuMode" @change="onMenuModeChange" :options="menuModeOptions" :allowEmpty="false" optionLabel="label" optionValue="value" />
            </div>
        </div>
    </div>
</template>
