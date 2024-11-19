<template>
    <FileUpload accept="image/*" mode="basic" multiple @select="selectedImage($event)" custom-upload auto></FileUpload>
    <div class="flex flex-col gap-2 mt-8">
        <div v-for="(item, index) in images" class="flex items-center gap-2">
            <div class="h-24 w-24 rounded-lg overflow-hidden border border-surface">
                <Image :src="imageSrc[index]" :preview="true" />
            </div>
            <div class="w-0 flex-1">
                <div class="w-full text-lg text-ellipsis overflow-hidden">{{item.name}}</div>
                <div>{{item.size}} KB</div>
                <Button icon="pi pi-trash" size="small" :label="t('common.delete')" severity="danger" @click="imageDelete(index)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from "primevue/button";
import Image from "primevue/image";
import FileUpload from "primevue/fileupload";
import {ref} from "vue";
import {useI18n} from "vue-i18n";

const { t, locale, availableLocales } = useI18n();
const images = defineModel('images');
const imageSrc = defineModel('imageSrc');

const imageFileReader = new FileReader();
imageFileReader.onload = (e) => {
    imageSrc.value.push(e.target.result);
}
// 处理文件选择的函数
const selectedImage = (event) => {
    const files = event.files; // 获取文件列表
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
            imageSrc.value.push(... previewUrls); // 将预览URLs按顺序存储
        })
        .catch((error) => {
            console.error("Error reading files", error);
        });
};
const imageDelete = (index) => {
    images.value.splice(index, 1);
    imageSrc.value.splice(index, 1);
}

</script>

<style scoped>

</style>