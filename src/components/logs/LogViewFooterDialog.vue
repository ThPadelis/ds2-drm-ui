<script setup>
import { inject } from 'vue';

const dialogRef = inject('dialogRef');

const closeDialog = (e) => {
    dialogRef.value.close(e);
};
</script>

<template>
    <div class="flex w-full">
        <Button type="button" label="Cancel" @click="closeDialog({ buttonType: 'Cancel' })" autofocus outlined></Button>
    </div>
</template>
