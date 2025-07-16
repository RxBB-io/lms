<template>
	<FileUploader
		:fileTypes="['image/*', 'video/*', 'audio/*', '.pdf', '.ppt', '.pptx', '.pps', '.ppsx', '.doc', '.docx', '.rtf']"
		:validateFile="validateFile"
		@success="(data) => addFile(data)"
		ref="fileUploader"
		class="hide"
	/>
</template>
<script setup>
import { FileUploader } from 'frappe-ui'
import { onMounted, ref, nextTick } from 'vue'

const fileUploader = ref(null)
const emit = defineEmits(['fileUploaded'])

const props = defineProps({
	onFileUploaded: {
		type: Function,
		required: true,
	},
})

onMounted(async () => {
	await nextTick()
	const fileInput = fileUploader.value.$el.querySelector('input[type="file"]')
	if (fileInput) {
		fileInput.click()
	}
})

const addFile = (file) => {
	props.onFileUploaded({
		file_url: file.file_url,
		file_type: file.file_type,
	})
}

const validateFile = (file) => {
	let extension = file.name.split('.').pop().toLowerCase()
	if (!['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'mp3', 'wav', 'ogg', 'pdf', 'ppt', 'pptx', 'pps', 'ppsx', 'doc', 'docx', 'rtf'].includes(extension)) {
		return 'Only image, video, audio, PDF, PowerPoint (.ppt, .pptx, .pps, .ppsx), and Word (.doc, .docx, .rtf) files are allowed.'
	}
	
	// Check file size (optional - you can adjust the limit)
	const maxSize = 100 * 1024 * 1024 // 100MB limit
	if (file.size > maxSize) {
		return 'File size must be less than 100MB.'
	}
}

const isVideo = (type) => {
	return ['mov', 'mp4', 'avi', 'mkv', 'webm'].includes(type.toLowerCase())
}

const isAudio = (type) => {
	return ['mp3', 'wav', 'ogg'].includes(type.toLowerCase())
}
</script>
