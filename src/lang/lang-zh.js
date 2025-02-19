let zhConfig = {
    login: {
        welcome: '欢迎回来！',
        login: '登录',
        register: '注册',
        forgetPassword: '忘记密码？',
        email: '邮箱（选填）',
        username: '用户名',
        nickname: '昵称',
        password: '密码',
        reenterYourPassword: '确认密码',
        rememberMe: '记住我',
        loginSuccess: '登录成功',
        usernameEtc: '用户名/邮箱',
        alreadyHaveAccount: '已有账号？',
        createAccount: '创建新账号',
        redirect: '正在跳转至首页，3秒后自动跳转...',
        goToHome: '前往首页',
        usernameRule: '6-20个字符，支持字母/数字/下划线，至少包含1个字母',
        usernameDigitLimit: '用户名长度需为6-20个字符',
        usernameContentLimit: '仅允许字母、数字和下划线',
        usernameTaken: '用户名已被占用',
        nicknameRule: '昵称规则：6-64个字符（可含字母、数字、符号等）',
        nicknameDigitLimit: '昵称长度需为6-64个字符',
        nicknameContentLimit: '可包含字母、数字及符号',
        passwordRule: '密码要求',
        passwordDigitLimit: '6-32个字符',
        passwordContentLimit: '需包含：大写字母、小写字母、数字、特殊符号，且不能有空格',
        rePasswordRule: '确认密码',
        rePasswordContentLimit: '两次输入的密码不一致',
        emailContentLimit: '请输入有效的邮箱地址',
        emailTaken: '该邮箱已被注册',
        locationOrCountry: '国家/地区',
        locationContentLimit: '请选择您所在的国家或地区',
        chooseLanguage: '选择您掌握或想学习的语言',
        languageRule: '您选择的语言将影响推荐内容和社区动态',
        addALanguage: '添加语言',
        languageProficiencyInfo: "语言熟练度说明：\n⭐ 基础：掌握基本词汇和短语\n⭐⭐ 初级：可进行简单对话\n⭐⭐⭐ 中级：能应对日常交流\n⭐⭐⭐⭐ 高级：熟练使用该语言\n⭐⭐⭐⭐⭐ 母语水平：精通复杂语境",
        proficiency: '语言水平',
        native: '母语者',
        languageContentLimit: '请至少添加一种语言',
        registerSuccess: '注册成功！',
        continueYourRegistration: '继续注册',
        rule: '规则',
        error: '错误提示'
    },
    base: {
        welcome: '欢迎回来，{nickname}！',
        onlineFor: '已学习 {second} 分钟'
    },
    common: {
        home: '首页',
        chat: '消息',
        bookmark: '收藏',
        me: '个人中心',
        error: '错误',
        confirm: '确认',
        cancel: '取消',
        delete: '删除',
        edit: '编辑',
        add: '添加',
        search: '搜索',
        reset: '重置',
        save: '保存',
        close: '关闭',
        back: '返回',
        next: '下一步',
        previous: '上一步',
        finish: '完成',
        skip: '跳过',
        previousStep: '上一步',
        nextStep: '继续',
        finishStep: '完成本步',
        skipStep: '跳过此步',
        skipAll: '全部跳过',
        finishAll: '全部完成',
        darkMode: '深色模式',
        lightMode: '浅色模式',
        followSystem: '跟随系统',
        theme: '主题设置',
        language: '语言设置',
        rule: '使用指南',
        optional: '（选填）',
        loading: '加载中',
        loadingWithDots: '加载中...',
        type: '输入内容',
        translate: '翻译',
        optimize: '优化',
        explain: '解释',
        translation: '译文',
        explanation: '解析',
        lookUp: '查词',
        translateFrom: '从{lang}翻译',
        pronounce: '发音',
        originalText: '原文',
        connectingNatively: '连接Natively中...',
        connectNativelySuccess: '连接已建立',
        more: '更多',
        following: "关注",
        timeline: '推荐',
        trending: '热门'
    },
    "post": {
        "post": "贴文",
        "postPlaceholder": "分享你的想法...",
        "titleNotEmpty": "提问必须填写标题",
        "titleLengthLimit": "标题上限：255字符",
        "contentLengthLimit": "正文上限：65,535字符",
        "titleRule": "简明描述主题（最多255字符）",
        "typeRule": "提问需标题 • 普通贴文标题可选填",
        "contentRule": "支持Markdown格式（上限65,535字符）",
        "question": "提问",
        "addAComment": "添加评论",
        "comment": "评论",
        "comments": "评论",
        "commentNotBlank": "评论内容不能为空",
        "commentContentLimit": "评论长度受限",
        "addImage": "插入图片",
        "addVoice": "添加语音",
        "hasMore": "展开更多...",
        "innerComment": "回复对话",
        "selectType": "选择内容类型",
        "normal": "普通贴文",
        "menu": "操作菜单",
        "bookmark": "收藏",
        "navi": "导航",
        "report": "举报",
        "containLanguages": "本贴包含哪些语言？",
        "next": "继续",
        "back": "返回",
        "selectedLanguage": "已选语言",
        "title": "标题",
        "titleOptional": "标题（选填）",
        "rule": "规范说明",
        "normalRule": "发帖规范：\n • 可选标题（上限250字符）\n • 最多30个内容块\n • 最多10张图片\n • 最多10条语音\n文件限制：\n • 图片≤4MB\n • 语音≤2MB\n • 总字数≤30,000字符",
        "clickLoadMore": "加载更多...",
        "continueReading": "展开全文",
        "bookmarkPostPrompt": "收藏该内容",
        "language": "语言设置",
        "compose": "新建贴文",
        "stat": "数据统计",
        "characterCount": "字数统计",
        "blockCount": "内容块数",
        "imageBlockCount": "图片数量",
        "voiceBlockCount": "语音条数",
        "overflow": "超出限制！",
        "delete": "删除",
        "deleteConfirm": "再次点击确认删除",
        "imageSizeLimit": "图片最大尺寸：4MB",
        "voiceSizeLimit": "语音消息上限：2MB",
        "composeNotSaveReminderTitle": "确认放弃草稿？",
        "composeNotSaveReminder": "所有修改将丢失",
        "latest": "最新",
        "oldest": "最早",
        "hotOrder": "热门",
        "orderBy": "排序方式",
        "more": "更多选项",
    },
    "composeComment": {
        "title": "撰写评论",
        "compare": "对比修改",
        "placeholder": "输入评论内容...",
        "compareOldValue": "原始内容",
        "compareNewValue": "修改版本",
        "compareOutput": "修改对比",
        "confirm": "发布评论",
        "cancel": "取消操作",
        "imageMenu": "插入图片",
        "voiceMenu": "添加语音",
        "compareMenu": "版本对比",
        "add": "新增",
        "change": "修改",
        "delete": "删除",
        "record": "录音",
        "upload": "上传文件"
    },
    "voiceRecorder": {
        "title": "语音消息",
        "start": "开始录音",
        "stop": "结束录音",
        "limit": "录音规范：\n • 最长30秒\n • 超时自动停止\n • 每条评论仅限一条语音\n • 异常时请刷新页面",
        "send": "发送语音"
    },
    "user": {
        "following": "关注中",
        "followers": "粉丝",
        "follow": "关注",
        "followBack": "回关",
        "unfollow": "取消关注",
        "mutualFollowing": "互相关注",
        "oops": "操作异常！",
        "bannedPrompt": "你已被 @{username} 屏蔽",
        "unblock": "解除屏蔽",
        "basicInformation": "基本信息",
        "username": "用户名",
        "nickname": "昵称",
        "avatar": "头像",
        "language": "语言偏好",
        "linkedAccount": "关联账户",
        "unlink": "解除关联",
        "link": "立即关联",
        "linkedAccountChangePrompt": "请先保存其他修改再变更账户关联",
        "save": "保存修改",
        "avatarIsUploading": "头像上传中...",
        "userInfoUpdated": "资料更新成功",
        "email": "电子邮箱",
        "chat": "私信",
        "bio": "个性签名",
        "password": "密码",
        "oldPassword": "当前密码",
        "newPassword": "新密码",
        "confirmNewPassword": "确认新密码",
        "update": "更新密码",
        "newPasswordNotMatch": "密码不一致",
        "changePasswordSuccessPrompt": "密码已更新，即将跳转登录...",
        "addLanguage": "新增语言"
    },
    "lang": {
        "en": "英语",
        "zh": "中文",
        "ko": "韩语",
        "ja": "日语",
        "fr": "法语",
        "enAbbr": "英",
        "zhAbbr": "中",
        "koAbbr": "韩",
        "jaAbbr": "日",
        "frAbbr": "法"
    },
    "imageUploader": {
        "send": "确认上传",
        "add": "添加图片",
        "change": "更换图片",
        "images": "图片集"
    },
    "bookmark": {
        "bookmark": "收藏夹",
        "addToBookmark": "加入收藏",
        "edit": "编辑",
        "remove": "移除",
        "post": "贴文",
        "comment": "评论",
        "note": "笔记",
        "close": "关闭面板",
        "update": "保存修改",
        "text": "文字笔记"
    },
    "chat": {
        "chat": "聊天",
        "message": "消息",
        "sending": "发送中...",
        "getOriginalImage": "查看原图",
        "contact": "联系人",
        menu: "菜单",
        close: '关闭',
        copy: '复制'
    },
    "navi": {
        "quote": "引用",
        "question": "问题",
        "ability": "能力",
        "translate": "即时翻译",
        "explain": "智能解析",
        "ask": "智能问答",
        "enterYourQuestion": "输入您的问题...",
        "originalText": "原文",
        "enterHere": "在此输入...",
        "retry": "重试",
        "pronounce": "发音",
        "autoDetect": "自动识别",
        "translation": "翻译结果",
        "back": "返回",
        "explainInputPlaceholder": "输入需要解析的内容...",
        "pronounceInputPlaceholder": "输入需朗读的文本...",
        "pronunciation": "发音",
        "content": "内容",
        "close": "关闭",
        "explanation": "智能解析",
        "wordInputPlaceholder": "输入查询词汇",
        "search": "搜索",
        "dictionary": "词典",
        "all": "全部结果",
        "word": "词汇解析",
        "translateInDeep": "深度翻译",
        "bookmark": "加入收藏夹",
        "note": "笔记",
        "save": "保存",
        "answer": "解答",
        "next": "下一步",
        ok: "收藏",
        translateFrom: '原文语言',
        translateTo: '目标语言',
    },
    "more": {
        "language": "语言",
        "logout": "退出登录",
        "editProfile": "编辑资料",
        "clickOneMoreTimeToLogout": "再次点击确认退出",
        "theme": "主题"
    },
    "editor": {
        "originalText": "原始文字",
        "revisedText": "修订文字",
        "output": "最终输出",
        "raw": "源码",
        "rendered": "预览",
        "image": "插入图片",
        "caption": "图片说明",
        "voice": "语音消息",
        "record": "开始录音",
        "noRecordingFound": "暂无录音文件",
        "upload": "上传文件",
        "preview": "内容预览",
        "text": "文字内容",
        "posting": "发布中..."
    },
    "search": {
        "placeholder": "搜索贴文/用户...",
        "search": "搜索",
        "history": "搜索历史",
        "user": "用户",
        "bookmark": "收藏内容",
        "post": "贴文",
        "languageFilter": "语言筛选",
        "sort": "排序方式",
        "latest": "最新优先",
        "oldest": "最早优先",
        "relevance": "相关度排序"
    },
    "loadMore": {
        "clickPrompt": "加载更多结果"
    },
    "file": {
        "pleaseSelectImage": "请选择图片文件",
        "pleaseSelectVoice": "请选择音频文件"
    }
}

export default zhConfig;