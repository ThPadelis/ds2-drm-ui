<script setup>
import { inject } from 'vue';

const dialogRef = inject('dialogRef');

const closeDialog = (e) => {
    dialogRef.value.close(e);
};
</script>

<template>
    <div class="flex w-full">
        <Button type="button" label="Close" @click="closeDialog({ buttonType: 'Cancel' })" autofocus></Button>
    </div>
</template>
