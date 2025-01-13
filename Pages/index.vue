<template>
    <div>
        <UButton @click="fnUpdate">Test</UButton><br>
        <UTable ref="refDataTable" sticky v-model:column-visibility="columnVisibility" :data="data"
            :columns="visibleColumns" class="flex-1 max-h-[312px]">
            <template #name-cell="{ row }">
                <ULink as="button">{{ row.original.name }}</ULink>

            </template>
        </UTable>
        {{ columnVisibility }}
    </div>

</template>

<script setup>
const refDataTable = ref()
const columnVisibility = ref({
    // id: false
})
const columns = ref([
    { accessorKey: 'id', header: 'Id', meta: { class: { th: 'all min-width' } }, hidden: false, alwaysVisible: true },
    { accessorKey: 'name', header: 'Name', meta: { class: { th: 'all min-width' } }, hidden: false },
    { accessorKey: 'title', header: 'Title', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'email', header: 'Email', class: '', hidden: false },
    { accessorKey: 'role', header: 'Role', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'englishName', header: 'EnglishName', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'titleI', header: 'TitleI', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'emailI', header: 'EmailI', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'roleI', header: 'RoleI', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'actions', header: 'Actions', meta: { class: { th: 'all min-width' } }, hidden: false, alwaysVisible: true },
]);

// Reactive visibleColumns updates based on scroll state
const visibleColumns = computed(() => {
    console.log('==========>>>', columns.value.filter(e => !e.hidden))
    return columns.value.filter(e => !e.hidden)

}
);

const data = ref([
    { id: 1, name: 'Lindsay Walton', englishName: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member', titleI: 'Front-end Developer', emailI: 'lindsay.walton@example.com', roleI: 'Member' },
    { id: 2, name: 'Courtney Henry', englishName: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin', titleI: 'Designer', emailI: 'courtney.henry@example.com', roleI: 'Admin' },
    { id: 3, name: 'Tom Cook', englishName: 'Tom Cook', title: 'Director of Product', email: 'tom.cook@example.com', role: 'Member', titleI: 'Director of Product', emailI: 'tom.cook@example.com', roleI: 'Member' },
    { id: 4, name: 'Whitney Francis', englishName: 'Whitney Francis', title: 'Copywriter', email: 'whitney.francis@example.com', role: 'Admin', titleI: 'Copywriter', emailI: 'whitney.francis@example.com', roleI: 'Admin' },
    { id: 5, name: 'Leonard Krasner', englishName: 'Leonard Krasner', title: 'Senior Designer', email: 'leonard.krasner@example.com', role: 'Owner', titleI: 'Senior Designer', emailI: 'leonard.krasner@example.com', roleI: 'Owner' },
    { id: 6, name: 'Floyd Miles', englishName: 'Floyd Miles', title: 'Principal Designer', email: 'floyd.miles@example.com', role: 'Member', titleI: 'Principal Designer', emailI: 'floyd.miles@example.com', roleI: 'Member' },
    { id: 7, name: 'Lindsay Walton', englishName: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member', titleI: 'Front-end Developer', emailI: 'lindsay.walton@example.com', roleI: 'Member' },
    { id: 8, name: 'Courtney Henry', englishName: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin', titleI: 'Designer', emailI: 'courtney.henry@example.com', roleI: 'Admin' },
    { id: 9, name: 'Tom Cook', englishName: 'Tom Cook', title: 'Director of Product', email: 'tom.cook@example.com', role: 'Member', titleI: 'Director of Product', emailI: 'tom.cook@example.com', roleI: 'Member' },
    { id: 10, name: 'Whitney Francis', englishName: 'Whitney Francis', title: 'Copywriter', email: 'whitney.francis@example.com', role: 'Admin', titleI: 'Copywriter', emailI: 'whitney.francis@example.com', roleI: 'Admin' },
    { id: 11, name: 'Leonard Krasner', englishName: 'Leonard Krasner', title: 'Senior Designer', email: 'leonard.krasner@example.com', role: 'Owner', titleI: 'Senior Designer', emailI: 'leonard.krasner@example.com', roleI: 'Owner' },
    { id: 12, name: 'Floyd Miles', englishName: 'Floyd Miles', title: 'Principal Designer', email: 'floyd.miles@example.com', role: 'Member', titleI: 'Principal Designer', emailI: 'floyd.miles@example.com', roleI: 'Member' },
])

// Check scroll state and toggle column visibility
async function updateColumnVisibility() {
    const tableElement = refDataTable.value?.$el;

    if (!tableElement) return;

    const scrollWidth = tableElement.scrollWidth;
    const clientWidth = tableElement.clientWidth;
    console.log(scrollWidth > clientWidth)
    if (scrollWidth > clientWidth) {
        // Hide the last visible column
        const visibleColumns = columns.value.filter(col => !col.hidden);
        if (visibleColumns.length > 0) {
            visibleColumns[visibleColumns.length - 1].hidden = true;
            refDataTable.value?.tableApi?.getColumn(visibleColumns[visibleColumns.length - 1].accessorKey).toggleVisibility(false)
            return true;
        }
    } else {
        // Show the first hidden column if space permits
        const hiddenCol = columns.value.find((col) => col.hidden);
        if (hiddenCol) {
            hiddenCol.hidden = false;
            refDataTable.value?.tableApi?.getColumn(hiddenCol.accessorKey).toggleVisibility(true)
        }
    }
    return false

}

async function adjustColumnsUntilNoScroll() {
    let hasScroll = true;
    while (hasScroll) {
        hasScroll = await updateColumnVisibility();
        await new Promise(resolve => setTimeout(resolve, 100)); // Add a small delay to avoid blocking
    }
}

function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

function fnUpdate() {
    data.value = data.value.filter(e => e.id != 1)
}


onMounted(() => {
    // updateColumnVisibility();

    // // Debounce resize events
    // const debouncedResize = debounce(updateColumnVisibility, 200);
    // window.addEventListener("resize", debouncedResize);
    adjustColumnsUntilNoScroll(); // Adjust columns on mount

    const debouncedResize = debounce(() => {
        adjustColumnsUntilNoScroll(); // Recheck on resize
    }, 200);

    window.addEventListener("resize", debouncedResize);

})

onUnmounted(() => {
    // Clean up the event listener
    window.removeEventListener('resize', debounce(adjustColumnsUntilNoScroll, 200));
});


</script>

<style>
.min-width,
.minWidth {
    width: 1px !important;
    white-space: nowrap !important;
}
</style>