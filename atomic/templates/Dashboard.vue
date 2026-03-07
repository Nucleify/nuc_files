<template>
  <section id="files">
    <nuc-entity-datatable-card
      :value="data"
      :loading="loading"
      :open-dialog="openDialog"
      :tag="3"
      ad-type="file"
      :header-text="t('entity-file-manage')"
      :button-text="t('entity-file-new')"
    />

    <nuc-dialog
      v-for="dialog in dialogs"
      :key="dialog.action"
      :entity="dialog.entity"
      :action="dialog.action"
      :visible="dialog.visible"
      :selected-object="selectedObject"
      :title="dialog.title"
      :fields="dialog.fields"
      :confirm-button-label="dialog.confirmButtonLabel"
      :cancel-button-label="dialog.cancelButtonLabel"
      :confirm="dialog.confirm"
      :get-data="dialog.getData"
      :close="closeDialog"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { NucDashboardInterface } from 'nucleify'
import { fileRequests, useFileFields, useNucDialog } from 'nucleify'

const props = defineProps<NucDashboardInterface>()
const { t } = useI18n()

const {
  visibleShow,
  visibleCreate,
  visibleEdit,
  visibleDelete,
  selectedObject,
  openDialog,
  closeDialog,
} = useNucDialog()

const { createAndEditFields, showFields } = useFileFields()
const { deleteFile, storeFile, editFile } = fileRequests(closeDialog)

const dialogs = computed(() => [
  {
    entity: 'file',
    action: 'show',
    visible: visibleShow.value,
    data: selectedObject.value,
    cancelButtonLabel: t('common-close'),
    fields: showFields,
  },
  {
    entity: 'file',
    action: 'delete',
    visible: visibleDelete.value,
    selectedObject: selectedObject.value,
    title: t('entity-file-delete'),
    confirmButtonLabel: t('common-confirm'),
    cancelButtonLabel: t('common-cancel'),
    confirm: deleteFile,
    getData: props.getData,
  },
  {
    entity: 'file',
    action: 'create',
    visible: visibleCreate.value,
    title: t('entity-file-create'),
    confirmButtonLabel: t('common-confirm'),
    cancelButtonLabel: t('common-cancel'),
    confirm: storeFile,
    getData: props.getData,
    fields: createAndEditFields,
  },
  {
    entity: 'file',
    action: 'edit',
    visible: visibleEdit.value,
    data: selectedObject.value,
    title: t('entity-file-edit'),
    confirmButtonLabel: t('common-update'),
    cancelButtonLabel: t('common-cancel'),
    confirm: editFile,
    getData: props.getData,
    fields: createAndEditFields,
  },
])
</script>
