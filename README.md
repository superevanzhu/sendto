# 说明
一键将当前md文件复制到指定目录。

# 用法

因为我用vscode管理markdown文件，有些文件需要放到hexo静态博客里面，不想每次都手动复制过去，所以做了这个扩展。

在vscode中使用时，`ctr+p`启动命令选择班，输入`sendto`，回车即可。

# 配置
在settings.json编辑，例如
```
    "sendto":{
        "target":"<目标目录>",
        "meta":true,//是否开启meta检查
    }
```

**target：目标目录**

比如我的就是`<hexo笔记项目>/source/_posts`。


**meta：true|false,开启则会检查并启动生成meta信息**

meta信息是md内容最前面的一段描述信息，用来给hexo框架生成html的。类似这样：
```
---
title: 文章标题
date: 2019-05-19
tags: 
---
```

我自己的笔记是不包含meta信息的，复制到hexo笔记是自动给它创建。


# 定制开发
- 发布：`vsce publish`

# 插件地址
https://marketplace.visualstudio.com/items?itemName=zhuwang.sendto

-END-