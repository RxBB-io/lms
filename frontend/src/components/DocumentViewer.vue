<template>
	<div class="mb-4 document-viewer">
		<!-- Document Header -->
		<div class="viewer-header bg-surface-gray-2 p-3 rounded-t-lg border border-b-0 border-outline-gray-2">
			<h4 class="text-sm font-medium text-ink-gray-9 mb-2">
				{{ isWordDocument ? '📄 Word Document' : '📊 PowerPoint Presentation' }}
			</h4>
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-4 text-xs">
					<a :href="fileUrl" target="_blank" class="text-blue-600 hover:text-blue-800 no-underline">
						🔗 Open in New Tab
					</a>
					<a :href="fileUrl" download class="text-green-600 hover:text-green-800 no-underline">
						⬇️ Download
					</a>
				</div>
				<div class="text-xs text-ink-gray-5">
					Viewer: {{ currentViewer === 'google' ? 'Google Docs' : currentViewer === 'office' ? 'Office 365' : 'Download Only' }}
				</div>
			</div>
		</div>

		<!-- Primary Viewer: Google Docs -->
		<iframe 
			v-show="currentViewer === 'google'"
			ref="googleViewer"
			:src="googleViewerUrl"
			width="100%" 
			height="600px" 
			frameborder="0"
			class="border border-outline-gray-2 border-t-0"
			@load="onGoogleViewerLoad"
			@error="onGoogleViewerError">
		</iframe>

		<!-- Fallback Viewer: Office 365 -->
		<iframe 
			v-show="currentViewer === 'office'"
			ref="officeViewer"
			:src="officeViewerUrl"
			width="100%" 
			height="600px" 
			frameborder="0"
			class="border border-outline-gray-2 border-t-0"
			@load="onOfficeViewerLoad"
			@error="onOfficeViewerError">
		</iframe>

		<!-- Final Fallback: Download Only -->
		<div v-show="currentViewer === 'download'" class="p-10 text-center border border-outline-gray-2 border-t-0 bg-surface-gray-1 rounded-b-lg">
			<div class="mb-5">
				<div class="text-5xl mb-3">{{ isWordDocument ? '📝' : '📋' }}</div>
				<h3 class="text-ink-gray-9 mb-3 font-medium">Preview Not Available</h3>
				<p class="text-ink-gray-6 mb-5 max-w-md mx-auto">
					The {{ isWordDocument ? 'Word document' : 'PowerPoint presentation' }} cannot be previewed in the browser. 
					Please download it to view the content.
				</p>
			</div>
			<Button @click="downloadFile" variant="solid">
				📥 Download {{ isWordDocument ? 'Word Document' : 'PowerPoint File' }}
			</Button>
		</div>

		<!-- Loading State -->
		<div v-show="isLoading" class="p-10 text-center border border-outline-gray-2 border-t-0 bg-surface-gray-1">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
			<p class="text-ink-gray-6">Loading document preview...</p>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { Button } from 'frappe-ui'

const props = defineProps({
	fileUrl: {
		type: String,
		required: true
	},
	fileType: {
		type: String,
		required: true
	}
})

const currentViewer = ref('google')
const isLoading = ref(true)
const googleViewer = ref(null)
const officeViewer = ref(null)

const isWordDocument = computed(() => {
	return ['doc', 'docx', 'rtf'].includes(props.fileType.toLowerCase())
})

const googleViewerUrl = computed(() => {
	const encodedUrl = encodeURIComponent(props.fileUrl)
	return `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`
})

const officeViewerUrl = computed(() => {
	const encodedUrl = encodeURIComponent(props.fileUrl)
	return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
})

const onGoogleViewerLoad = () => {
	console.log('Google Docs viewer loaded successfully')
	isLoading.value = false
	
	// Additional check after a delay to ensure content is actually loaded
	setTimeout(() => {
		try {
			const iframe = googleViewer.value
			if (iframe && (!iframe.contentDocument && !iframe.contentWindow)) {
				console.log('Google viewer loaded but no content detected, switching to Office viewer')
				currentViewer.value = 'office'
			}
		} catch (e) {
			console.log('Google viewer content check failed, switching to Office viewer')
			currentViewer.value = 'office'
		}
	}, 3000)
}

const onGoogleViewerError = () => {
	console.log('Google Docs viewer failed, switching to Office viewer')
	currentViewer.value = 'office'
	isLoading.value = false
}

const onOfficeViewerLoad = () => {
	console.log('Office 365 viewer loaded successfully')
	isLoading.value = false
}

const onOfficeViewerError = () => {
	console.log('Office 365 viewer failed, switching to download only')
	currentViewer.value = 'download'
	isLoading.value = false
}

const downloadFile = () => {
	window.open(props.fileUrl, '_blank')
}

onMounted(async () => {
	await nextTick()
	
	// Set a timeout to fallback if loading takes too long
	setTimeout(() => {
		if (isLoading.value) {
			console.log('Viewer loading timeout, switching to Office viewer')
			currentViewer.value = 'office'
		}
	}, 8000)
	
	// Ultimate fallback timeout
	setTimeout(() => {
		if (currentViewer.value === 'office' && isLoading.value) {
			console.log('All viewers timeout, switching to download only')
			currentViewer.value = 'download'
			isLoading.value = false
		}
	}, 15000)
})
</script>

<style scoped>
.document-viewer {
	max-width: 100%;
}

.no-underline {
	text-decoration: none;
}

.no-underline:hover {
	text-decoration: underline;
}
</style> 