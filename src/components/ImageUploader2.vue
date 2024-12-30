<template>
    <Drawer v-model:visible="visible" :header="`${t('imageUploader.images')} (${images.length}/${props.limit})`" position="bottom" class="!rounded-t-2xl !z-20 !h-auto !max-h-[90dvh] !max-w-[35rem]">
        <div v-if="images.length" class="flex flex-col gap-2 mb-6">
            <div v-for="(item, index) in images" class="flex items-center gap-2">
                <div class="h-24 w-24 rounded-lg overflow-hidden border border-surface">
                    <Image :src="imageSrc[index]" :preview="true" />
                </div>
                <div class="w-0 flex-1">
                    <div class="w-full text-lg text-ellipsis overflow-hidden">{{item.name}}</div>
                    <div class="mb-1">{{item.size}} KB</div>
                    <Button icon="pi pi-trash" size="small" :label="t('common.delete')" severity="danger" @click="imageDelete(index)" />
                </div>
            </div>
        </div>
        <div v-else>
        
        </div>
        <div class="w-full flex justify-evenly *:flex-1 gap-2 sticky bottom-0 drop-shadow-2xl">
            <Button v-if="props.limit === 1 && images.length === 1" :label="t('imageUploader.change')" icon="pi pi-refresh" @click="inputElement.click()" />
            <Button v-else :label="t('imageUploader.add')"  icon="pi pi-plus" @click="inputElement.click()" />
            <Button v-if="props.enableSend" @click="emits('send')" :label="t('imageUploader.send')" icon="pi pi-send" />
        </div>
    </Drawer>
    <input type="file" accept="image/*" class="hidden" ref="inputElement" :multiple="props.limit !== 1" />
</template>

<script setup>
import Button from "primevue/button";
import Image from "primevue/image";
import FileUpload from "primevue/fileupload";
import {onBeforeUnmount, onMounted, onUnmounted, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import Drawer from "primevue/drawer";

const {t, locale, availableLocales} = useI18n();
const images = defineModel('images');
const imageSrc = defineModel('imageSrc');
const visible = ref(false);
const props = defineProps({
    enableSend: {
        default: false,
    },
    limit: {
        default: 9
    }
})
const emits = defineEmits(["send"])

//input
const toggle = () => {
    visible.value = !visible.value;
}
defineExpose({ toggle });
const inputElement = ref(null);
const change = (e) => {
    selectedImage(e.target);
}

// file reader
const imageFileReader = new FileReader();
imageFileReader.onload = (e) => {
    imageSrc.value.push(e.target.result);
}
// 处理文件选择的函数
const selectedImage = (event) => {
    let fileList = event.files; // 获取文件列表
    let files = [... fileList];
    
    if(props.limit === 1){
        images.value.splice(0, 1);
        imageSrc.value.splice(0, 1);
    }

    const remainingLimit = props.limit - images.value.length;
    // 如果剩余文件数大于0，则只保留 files 中的前 `remainingLimit` 个文件
    if (remainingLimit > 0) {
        // 截取前 remainingLimit 个文件
        files = files.slice(0, remainingLimit);
    } else {
        // 如果没有剩余的空间，则不允许再添加文件
        console.log('已达到上传文件限制');
        return;
    }
    
    images.value.push(...files); // 将文件添加到 images 数组中

    // 创建一个新的 Promise 数组，用于读取每个文件
    const filePromises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
            const imageFileReader = new FileReader(); // 为每个文件创建新的 FileReader

            // 监听文件加载事件
            imageFileReader.onload = (e) => {
                resolve(e.target.result); // 读取成功，返回文件的预览URL
            };

            // 监听文件读取错误
            imageFileReader.onerror = (error) => {
                reject(error); // 读取失败，返回错误
            };

            imageFileReader.readAsDataURL(file); // 读取文件数据
        });
    });

    // 等待所有文件读取完成，然后更新 imageSrc
    Promise.all(filePromises)
        .then((previewUrls) => {
            imageSrc.value.push(...previewUrls); // 将预览URLs按顺序存储
        })
        .catch((error) => {
            console.error("Error reading files", error);
        });
};
const imageDelete = (index) => {
    images.value.splice(index, 1);
    imageSrc.value.splice(index, 1);
}

// lifespan
onMounted(() => {
    inputElement.value.addEventListener("change", change);
})

onBeforeUnmount(() => {
    inputElement.value.removeEventListener("change", change);
})

</script>

<style scoped>

</style>