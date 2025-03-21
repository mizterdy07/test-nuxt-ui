<template>
    <div>
        <UButton @click="fnResponsive">Responsive</UButton><br>
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
    { accessorKey: 'expand', header: '', meta: { class: { th: 'all min-width' } }, hidden: false, alwaysVisible: true },
    { accessorKey: 'id', header: 'Id', meta: { class: { th: 'all min-width' } }, hidden: false, alwaysVisible: true },
    { accessorKey: 'name', header: 'Name', meta: { class: { th: 'all min-width' } }, hidden: false },
    { accessorKey: 'title', header: 'Title', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'email', header: 'Email', class: '', hidden: false },
    { accessorKey: 'role', header: 'Role', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'englishName', header: 'EnglishName', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'titleI', header: 'Title 1', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'emailI', header: 'Email 1', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'roleI', header: 'Role 1', meta: { class: { th: 'min-width' } }, hidden: false },
    { accessorKey: 'actions', header: 'Actions', meta: { class: { th: 'all min-width' } }, hidden: false, alwaysVisible: true },
]);

// Reactive visibleColumns updates based on scroll state
const visibleColumns = computed(() => {
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

const previousWidth = ref(0)
const BREAKPOINT_BUFFER = 50 // Buffer to prevent rapid toggling

// Recursive function for initial setup
async function recursiveColumnAdjustment(attempt = 0, maxAttempts = 20) {
    const tableElement = refDataTable.value?.$el;
    if (!tableElement || attempt >= maxAttempts) return;

    const scrollWidth = tableElement.scrollWidth;
    const clientWidth = tableElement.clientWidth;

    if (scrollWidth > clientWidth) {
        const visibleColumns = columns.value
            .filter(col => !col.hidden && !col.alwaysVisible);

        if (visibleColumns.length > 0) {
            const lastColumn = visibleColumns[visibleColumns.length - 1];
            lastColumn.hidden = true;
            refDataTable.value?.tableApi?.getColumn(lastColumn.accessorKey).toggleVisibility(false);

            await nextTick();
            await recursiveColumnAdjustment(attempt + 1, maxAttempts);
        }
    }
}

function handleResize() {
    if (typeof window === 'undefined') return;

    const tableElement = refDataTable.value?.$el;
    if (!tableElement) return;

    const currentWidth = window.innerWidth;
    const widthDifference = currentWidth - previousWidth.value;

    if (Math.abs(widthDifference) > BREAKPOINT_BUFFER) {
        if (widthDifference > 0) {
            tryShowColumn();
        } else {
            tryHideColumn();
        }
        previousWidth.value = currentWidth;
    }
}

function tryShowColumn() {
    const tableElement = refDataTable.value?.$el;
    if (!tableElement) return;

    const hiddenColumns = columns.value
        .filter(col => col.hidden && !col.alwaysVisible)
        .sort((a, b) => columns.value.indexOf(a) - columns.value.indexOf(b));

    if (hiddenColumns.length > 0) {
        const columnToShow = hiddenColumns[0];
        columnToShow.hidden = false;
        refDataTable.value?.tableApi?.getColumn(columnToShow.accessorKey).toggleVisibility(true);

        setTimeout(() => {
            const newScrollWidth = tableElement.scrollWidth;
            const newClientWidth = tableElement.clientWidth;
            if (newScrollWidth <= newClientWidth && hiddenColumns.length > 1) {
                tryShowColumn();
            }
        }, 50);
    } else {
        // columnVisibility.value = {}
        // console.log('---->>', columnVisibility.value)
    }
}

function tryHideColumn() {
    const tableElement = refDataTable.value?.$el;
    if (!tableElement) return;

    const scrollWidth = tableElement.scrollWidth;
    const clientWidth = tableElement.clientWidth;

    if (scrollWidth > clientWidth) {
        const visibleColumns = columns.value
            .filter(col => !col.hidden && !col.alwaysVisible)
            .sort((a, b) => columns.value.indexOf(b) - columns.value.indexOf(a));

        if (visibleColumns.length > 0) {
            const columnToHide = visibleColumns[0];
            columnToHide.hidden = true;
            refDataTable.value?.tableApi?.getColumn(columnToHide.accessorKey).toggleVisibility(false);

            setTimeout(() => {
                const newScrollWidth = tableElement.scrollWidth;
                const newClientWidth = tableElement.clientWidth;
                if (newScrollWidth > newClientWidth) {
                    tryHideColumn();
                }
            }, 50);
        }
    }
}

function debounce(fn, delay = 100) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

onMounted(() => {
    if (typeof window !== 'undefined') {
        previousWidth.value = window.innerWidth;
        nextTick(() => {
            recursiveColumnAdjustment();
        });

        const debouncedResize = debounce(handleResize);
        window.addEventListener("resize", debouncedResize);
    }
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        const debouncedResize = debounce(handleResize);
        window.removeEventListener('resize', debouncedResize);
    }
});

const showCollapseExpand = ref(false)
watch(columnVisibility, (n) => {
    if (n) {
        const visibilityAllTrue = Object.values(n).every(value => value === true)
        console.log('---->>>', visibilityAllTrue)
        if (Object.values(n).every(value => value === true) === true) {
            showCollapseExpand.value = false
        } else {
            showCollapseExpand.value = true
        }
    }
}, { deep: true })

</script>

<style>
.min-width,
.minWidth {
    width: 1px !important;
    white-space: nowrap !important;
}
</style>