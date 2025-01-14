<template>
    <div class="flex-1 w-full">
        <UButton @click="reCulResponsive">Responsive</UButton><br>
        <UTable ref="refDataTable" sticky v-model:column-visibility="columnVisibility"
            v-model:row-selection="rowSelection" :data="data" :columns="visibleColumns" class="flex-1 max-h-[312px]">
            <template #name-cell="{ row }">
                <ULink as="button">{{ row.original.name }}</ULink>
            </template>
        </UTable>
        {{ columnVisibility }}
        <div class="px-4 py-3.5 border-t border-[var(--ui-border-accented)] text-sm text-[var(--ui-text-muted)]">
            {{ refDataTable?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
            {{ refDataTable?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
        </div>
    </div>

</template>

<script setup>
const UCheckbox = resolveComponent('UCheckbox')
const refDataTable = ref()
const columnVisibility = ref({})
const rowSelection = defineModel('select')
const columns = ref([
    { accessorKey: 'expand', header: '', meta: { class: { th: 'all min-width' } }, hidden: false, alwaysVisible: true },
    {
        accessorKey: 'select',
        header: ({ table }) =>
            h(UCheckbox, {
                modelValue: table.getIsSomePageRowsSelected()
                    ? 'indeterminate'
                    : table.getIsAllPageRowsSelected(),
                'onUpdate:modelValue': (value) =>
                    table.toggleAllPageRowsSelected(!!value),
                ariaLabel: 'Select all'
            }),
        cell: ({ row }) =>
            h(UCheckbox, {
                modelValue: row.getIsSelected(),
                'onUpdate:modelValue': (value) => row.toggleSelected(!!value),
                ariaLabel: 'Select row'
            })
    },
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
const BREAKPOINT_BUFFER = columns.value.length;

async function recursiveColumnAdjustment() {
    const tableElement = refDataTable.value?.$el;

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
            await recursiveColumnAdjustment();
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
        }

        previousWidth.value = currentWidth;

        clearTimeout(window.handleReCal);
        window.handleReCal = setTimeout(() => {
            reCulResponsive();
        }, 50);
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
        }, 10);
    }
}

function debounce(fn, delay = 100) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

function reCulResponsive() {
    if (typeof window !== 'undefined') {
        previousWidth.value = window.innerWidth;
        nextTick(() => {
            recursiveColumnAdjustment();
        });
    }
}

onMounted(() => {
    if (typeof window !== 'undefined') {
        reCulResponsive()

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