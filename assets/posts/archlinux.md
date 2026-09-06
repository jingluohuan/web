# archlinux保姆安装教程

文章编写日期2026年8月

## 前言

archlinux发展到今天7.x内核，已经不是当年5.x内核容易滚挂的时代了

当年大多滚挂都是因为NVIDIA显卡驱动导致的（Xorg以及NVIDIA驱动闭源的问题）

相比Ubuntu或是Fedora或许在开箱即用上有所欠缺，类似内核热重载等相关问题在此文章不做拓展

但不可否认的是arch仍是新手最快掌握linux基本操作以及理解linux的一个发行版

archlinux文档极其标准以及完善，90%以上的问题均可以在[ArchLinux Wiki](https://wiki.archlinux.org/) & [ArchLinux Wiki 中文](https://wiki.archlinuxcn.org/) 中找到解决方法。本文章相关参考文献（文档）均会在底部进行标注与附录

本教程以真实情况进行说明并给出的均为实体机代码（操作前核对文章日期），针对官方内核（linux）进行编写。

部分专业术语不理解的地方请善于询问AI，但请注意

**非必要，请不要使用ai可能给出的过时代码进行操作**

## 教程开始

### 1. ISO 镜像准备

准备一个8G以上的U盘

访问官方下载网址[https://archlinux.org/download/](https://archlinux.org/download/)

![](https://blogcdn.cyrilhub.com/blogimg/20260810214157323.avif)

中国网络环境下推荐使用中科大的镜像源网页下载[中科大archlinux ISO](https://mirrors.ustc.edu.cn/archlinux/iso/latest/)

镜像写入工具这里推荐使用[etcher](https://etcher.balena.io/)

将镜像写入到U盘中，写入完成后，重启进入Bios中关闭Secure Boot（安全启动）

启动项选择该U盘进行启动，关于启动问题这里不做拓展，镜像是否写入成功，U盘启动，安全启动是否关闭请自行根据各自实际情况确认。

### 2. 安装系统

本步骤以手动安装为主，即使archlinux提供[archinstall](https://wiki.archlinux.org/wiki/Archinstall)这类官方一键安装脚本，但仍推荐手动安装一遍。本步骤主要参考 [Arch Linux 官方安装指南（Installation guide）](https://wiki.archlinux.org/title/Installation_guide)。

进入live系统，等待加载后，此时界面应该在此页面

![](https://blogcdn.cyrilhub.com/blogimg/20260811000243918.avif)

#### 2.1 连接互联网

如果你是网线连接，并可以确保自动DHCP配置IP，可以忽略该章节，判断方式如下

```bash
ping bing.com
```

有字节返回，即为联网成功，Ctrl+C退出ping

使用无线网进行连接使用[iwctl](https://wiki.archlinuxcn.org/wiki/Iwd#iwctl)进行连接

>非免驱的移动网卡请使用网线连接

输入该命令进入交互式提示符

```bash
iwctl
```

![](https://blogcdn.cyrilhub.com/blogimg/20260811001247329.avif)

如果不知道你的网络设备名称，请列出所有 WiFi 设备

```bash
device list
```

通常为wlan0（），如果设备或其相应的适配器已关闭，请将其打开。

```bash
device _name_ set-property Powered on
```

>此处的_name_需要改成实际的无线网卡名称，例如device wlan0 set-property Powered on

开启后即可开始扫描网络（以下操作以网卡wlan0操作）（注意：这个命令不会输出任何内容）

```bash
station wlan0 scan
```

再然后，就可以列出所有可用的网络

```bash
station wlan0 get-networks
```

连接到一个网络

```bash
station wlan0 connect _SSID_
```

>SSID根据自己扫描到的网络进行填写。

随后输入密码（正常输入即可，不会有任何输出，输入完成后回车）

若SSID以及密码正确，此时不会报错。

然后测试网络连通性

```bash
ping bing.com
```

有字节返回，即为联网成功，Ctrl+C退出ping

#### 2.2 更新系统时间

默认连接网络后，时间会自动同步，但仍建议手动运行一次[timedatectl](https://man.archlinux.org/man/timedatectl.1)

```bash
timedatectl
```

出现下图即为成功（展示的时间并非不准确，而是默认时区使用UTC）

![](https://blogcdn.cyrilhub.com/blogimg/20260811003355024.avif)

#### 2.3 创建硬盘分区

本文章只提供基础的单硬盘安装方案，若要使用[LVM](https://wiki.archlinux.org/title/LVM)，[RAID](https://wiki.archlinux.org/title/RAID) 请在此章节完成，详细流程点击链接查看。

使用[fdisk](https://wiki.archlinux.org/title/Fdisk)查看硬盘

```bash
fdisk -l
```

>如果你是机械硬盘，往往显示的会是包含/dev/sda，若nvme硬盘，则显示的为/dev/nvme0n1（一句话，sata连接的多数都是sda一类，直接插主板的多数显示nvme）

以下操作以机械硬盘为示例（请根据你实际显示的硬盘路径进行）

创建硬盘新gpt分区

```bash
fdisk /dev/sda
```

在进入后输入g，回车、w，回车

![](https://blogcdn.cyrilhub.com/blogimg/20260811004147558.avif)

随后开始分区，使用[cfdisk](https://wiki.archlinuxcn.org/wiki/Cfdisk)进行可视化分区

```bash
cfdisk /dev/sda
```

我们需要三个分区，分别是EFI分区，SWAP分区，以及文件系统分区

键盘左右键移动到New，并回车，然后会提示Partition Size，输入1G并回车（严格按照此大小配置）

![](https://blogcdn.cyrilhub.com/blogimg/20260811004903910.avif)

左右移动到Type，回车，选择最上方的**EFI System**回车

继续按照此流程（上下选择未被分区的部分）创建Swap分区，分区大小按照内存的一半，16G的硬件内存推荐8G的Swap，Type选择**Linux Swap**

剩余空间全部分配，类型选择**Linux filesystem**

此时页面应为这样，包含三个分区，确保分区类型正确

![](https://blogcdn.cyrilhub.com/blogimg/20260811011746973.avif)

左右移动到Write，回车，输入yes，回车，移动到Quit回车退出，此时分区完成

##### 格式化分区

默认使用ext4作为文件系统类型，

```bash
mkfs.fat -F 32 /dev/sda1 && mkswap /dev/sda2 && mkfs.ext4 /dev/sda3
```

>若非sda，而是nvme0n1的话，此时三个分区的路径应为nvme0n1p1，nvme0n1p2，nvme0n1p3，一切请跟着实际走。

##### 挂载分区

>注意：顺序不能反

```bash
mount /dev/sda3 /mnt && mount /dev/sda1 /mnt/boot && swapon /dev/sda2 
```

#### 2.4 修改 Pacman 下载源

国外网络环境非必要，国内用户请按照以下进行中科大源配置

```bash
vim /etc/pacman.d/mirrorlist
```

>具体vim操作请自行找教程，本文章不做拓展

在文件顶部添加

```text
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

保存退出

#### 2.5 正式安装系统

>执行此步骤请确保上面硬盘分区、挂载，Pacman下载源均已做好

```text
pacstrap -K /mnt base base-devel linux linux-firmware sof-firmware networkmanager sudo vim zsh grub efibootmgr
```

一路回车，直到安装完成！

#### 2.6 配置系统

##### 生成 fstab 文件

```bash
genfstab -U /mnt > /mnt/etc/fstab
```

执行完之后，检查文件是否存在，并包含三行条目

```bash
cat /mnt/etc/fstab
```

##### chroot 到新安装的系统

```bash
arch-chroot -S /mnt
```

>此处使用的是arch-chroot而不是直接使用chroot，注意不要输错了。

##### 设置时间和时区

根据自己实际的时间区域配置，会影响到后面的时间显示。

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

然后运行 [hwclock(8)](https://man.archlinux.org/man/hwclock.8) 以生成 `/etc/adjtime`

```bash
hwclock --systohc
```

##### 区域和本地化设置（重要）

编辑/etc/locale.gen

```bash
vim /etc/locale.gen
```

将en_US.UTF-8 UTF-8  和en_SG.UTF-8 UTF-8以及最下面的zh_SG开头的均移除注释。

然后保存退出

>不做zh_CN是因为不推荐（别问）

接着执行 `locale-gen` 以生成 locale 信息：

```bash
locale-gen
```

创建locale.conf文件

```bash
vim /etc/locale.conf
```

在第一行输入：`LANG=en_SG.UTF-8`，保存退出

>如果在此处设置为中文 locale，这可能会导致 tty 上中文显示为方块（因为 TTY 下没有 CJK 字体），后面安装桌面以及字体之后即可切换中文。

##### 配置 Hostname

```bash
vim /etc/hostname
```

输入你想要配置的名称，小写以及数字，开头不能有`-`，后续可在终端看到。

##### 关于 initramfs

通常不需要自己创建新的 _initramfs_，因为在执行 _pacstrap_ 时已经安装 [kernel](https://wiki.archlinux.org/title/Kernel "Kernel")包，这时已经运行过 [mkinitcpio](https://wiki.archlinux.org/title/Mkinitcpio) 了。

当然也可以再次执行一遍

```bash
mkinitcpio -P
```

##### 设置 root 密码

```bash
passwd
```

会让你输入两遍新的密码

##### 配置用户账户

添加用户

```bash
useradd -m -G "wheel" -s "/usr/bin/zsh" "你的用户名"
```

修改用户密码

```bash
passwd 你的用户名
```

依旧会让你输入两遍新的密码

##### 配置 sudo 无密码

>参考：[Sudo 官方文档](https://wiki.archlinux.org/title/Sudo)

```bash
vim /etc/sudoers
```

在最下面找到这一行并取消注释

![](https://blogcdn.cyrilhub.com/blogimg/20260811022228677.avif)

>注意，这个文件需要强制保存，Esc后输入`:w!` 提示written后，再`:q!`退出。

##### 安装引导程序（重要）

>此步骤请确保执行成功，否则重启之后无法找到系统

>如果你pacstrap执行的时候，命令和我上面一致，包含`grub` `efibootmgr`则继续执行

>否则请先**pacman -Sy grub efibootmgr**安装

安装完成后输入

```bash
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
```

生成配置文件

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

出现done即为完成。

#### 2.7 重新启动计算机

输入 `exit` 或按 `Ctrl+d` 退出 chroot 环境。

拔掉你的U盘，然后输入`reboot`进行重启。

重启之后，tty显示需要登录，即为安装系统成功。

恭喜，完成到这里，你已经打败了全球80%的人类了。

### 3. 进入系统（首次启动）

输入你的用户名，密码为你前面输入的密码。

#### 3.1 配置联网

从live环境退出后，网络并不会自动配置。

配置网络管理器自启动（参考 [NetworkManager 官方文档](https://wiki.archlinux.org/title/NetworkManager)）

```zsh
sudo systemctl enable --now NetworkManager
```

此时，如果你是网线连接，则无需额外配置，可以忽略该章节后面的内容，无线网wifi情况操作如下。

显示附近的 Wi-Fi 网络

```zsh
nmcli device wifi list
```

连接到 Wi-Fi 网络

```zsh
nmcli device wifi connect _SSID_ password _密码_
```

>举例：无线网名称为TP-LINK-xxx，密码为12345678。

>则命令写成`nmcli device wifi connect TP-LINK-xxx password 12345678`

连接成功后，测试网络连通性

```zsh
ping bing.com
```

有字节返回，即为联网成功，Ctrl+C退出ping

#### 3.2 配置 archlinuxcn 源

依旧中科大（参考 [Arch Linux CN 仓库文档](https://wiki.archlinuxcn.org/wiki/Archlinuxcn)）

编辑`/etc/pacman.conf`

```zsh
sudo vim /etc/pacman.conf
```

先取消multilib注释（32位库）

![](https://blogcdn.cyrilhub.com/blogimg/20260811023531410.avif)

在下方添加

```zsh
[archlinuxcn]  
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
```

保存退出

随后安装公钥（证书部分慢，耐心等待）

```zsh
sudo pacman -Sy archlinuxcn-keyring
```

##### 安装 yay（AUR）

AUR仓库作为archlinux的最大优势，几乎**所有**软件都可以在AUR上找到相关的包（可参考 [AUR helpers 官方文档](https://wiki.archlinux.org/title/AUR_helpers)）。

yay作为AUR的包管理器，同时也可以接替arch本身的`pacman`

archlinuxcn源配置后安装

```zsh
sudo pacman -Sy yay
```

安装成功后，后续所有的安装命令均可使用`yay`

#### 3.3 安装字体

英文推荐[ttf-jetbrains-mono](https://archlinux.org/packages/?name=ttf-jetbrains-mono)以及[noto-fonts](https://archlinux.org/packages/?name=noto-fonts)

中文推荐[noto-fonts-cjk](https://archlinux.org/packages/?name=noto-fonts-cjk)

安装命令

```zsh
yay -Sy ttf-jetbrains-mono noto-fonts noto-fonts-cjk
```

#### 3.4 显卡驱动

##### Intel 显卡（核显和独显均通用）

二代以后的设备安装

```zsh
yay -Sy mesa vulkan-intel
```

VA-API（视频硬件加速）

八代以后额外安装`intel-media-driver`(应该没有更老的吧，八代之前的安装`libva-intel-driver`，太老的不建议装显卡驱动，老实做个服务器吧。)

##### AMD 显卡

最通用，安装

```zsh
yay -Sy mesa
```

RDNA架构可选安装`vulkan-radeon`

##### NVIDIA 显卡

>Linus Torvalds经典名句：so nvidia ,Fuck you!

在社区不断的努力下，开源DRM 驱动诞生了

[Turing (NV160/TUXXX)](https://nouveau.freedesktop.org/CodeNames.html#NV160) 及之后的版本请直接安装[nvidia-open](https://archlinux.org/packages/?name=nvidia-open)等相关包，驱动配置详见 [NVIDIA 官方文档](https://wiki.archlinux.org/title/NVIDIA)。

太老的卡，就不要装nv驱动了，即使社区有包，也并不推荐。

```zsh
yay -Sy nvidia-open nvidia-utils lib32-nvidia-utils
```

编辑`/etc/mkinitcpio.conf`

```zsh
sudo vim /etc/mkinitcpio.conf
```

移除kms

![](https://blogcdn.cyrilhub.com/blogimg/20260811031649359.avif)

保存退出， 重新生成 initramfs

```zsh
sudo mkinitcpio -P
```

然后重启你的电脑（必须）

重新登录，输入`nvidia-smi`

出现你的显卡，即为成功。

>只有NVIDIA会复杂，其他两家基本都是开箱即用，无需额外操作。

#### 3.5 安装图形化桌面（KDE）

本文章只介绍KDE（一是完善，兼容性目前最好，二是上手难度低），可参考 [KDE](https://wiki.archlinux.org/title/KDE) 与 [SDDM](https://wiki.archlinux.org/title/SDDM) 官方文档。

安装命令

```zsh
yay -Sy plasma kde-applications plasma-login-manager
```

一路回车，安装好后输入

```zsh
sudo systemctl enable --now sddm
```

此时会进入登录页面，确保左上角切换成_Plasma (Wayland)_

输入你的密码然后进入。

>一堆巴拉巴拉不如你实际上手，kde启动程序很少会通过鼠标，当你命令行安装了某个包含桌面desktop文件的软件时，即使没有出现在桌面上，你想打开可以`alt+空格`快捷启动栏，输入软件名称即可（在安装中文输入法之前，可以先输入英文）。

>`alt+空格`输入 konsole 打开终端

![](https://blogcdn.cyrilhub.com/blogimg/20260811034648516.avif)

##### 配置中文

打开`system setting`，找到`Region&Language`

![](https://blogcdn.cyrilhub.com/blogimg/20260811033053525.avif)

点击编辑

如果有提示The language "en_SG" is unsupported，不要担心，不用管它。

下面add添加简体中文，然后拖动到最上面即可。

此时会提示你是否注销，建议点击注销，让配置立刻生效。

##### 安装输入法（Fcitx5）

本文章只介绍Fcitx5（参考 [Fcitx5 官方文档](https://wiki.archlinux.org/title/Fcitx5)）

直接安装

```zsh
yay -Sy fcitx5-im fcitx5-chinese-addons fcitx5-qt fcitx5-gtk
```

编辑~/.config/gtk-3.0/settings.ini

在里面添加一行`gtk-im-module = fcitx`

编辑/etc/environment

在里面添加一行`XMODIFIERS=@im=fcitx`

系统设置里面找到输入法配置

如图添加Pinyin

![](https://blogcdn.cyrilhub.com/blogimg/20260811033857473.avif)

应用保存

找到键盘-虚拟键盘，勾选Fcitx5 Wayland应用即可。

![](https://blogcdn.cyrilhub.com/blogimg/20260811033953224.avif)

随后就可以通过Ctrl+空格调出输入法（无需自启动Fcitx5）

如果是安装fcitx5之前就已经打开的软件，需要彻底关闭软件，然后重新打开即可使用到输入法

### 4. 常用软件安装

#### 4.1 代理软件

AUR仓库很多都需要通过Github获取源代码或是发行版文件，若网络不通则会导致下载失败

而常见的像[v2rayn-bin](https://aur.archlinux.org/packages/v2rayn-bin),[clash-verge-rev-bin](https://aur.archlinux.org/packages/clash-verge-rev-bin)（后面带bin说明是已经编译好的可执行程序，无需拷贝源码编译）

这里推荐v2rayN

```zsh
yay -Sy v2rayn-bin
```

此过程安装可能缓慢，只要有速度就耐心等待，直连也不会很慢，看各位运营商情况。

安装完成后，`alt+空格`，输入v2rayN，回车启动

![](https://blogcdn.cyrilhub.com/blogimg/20260811034428447.avif)

剩下的就看各位自己的了，应该也不需要教这个怎么用吧。

#### 4.2 浏览器

还是只推荐[google-chrome](https://aur.archlinux.org/packages/google-chrome/)

```zsh
yay -Sy google-chrome
```

#### 4.3 oh-my-zsh

konsole 中输入以下命令

```zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

完成后会提示

```zsh
Do you want to overwrite it with the Oh My Zsh template? [Y/n] 
```

回车即可。

安装成功后应如下图所示

![](https://blogcdn.cyrilhub.com/blogimg/20260810215618713.avif)

##### oh-my-zsh 插件

虽是推荐，但基本上属于使用必装插件，此处不过多推荐，若需要其他插件可以查看[Oh-My-Zsh插件列表](https://github.com/ohmyzsh/ohmyzsh/wiki/plugins)

插件安装本质上就是clone对应的插件仓库，并移动到用户下oh-my-zsh的插件目录

这里使用yay进行安装插件（上游仓库更新可以及时同步）

```zsh
yay -Sy zsh-autosuggestions zsh-syntax-highlighting
```

此命令会安装zsh-autosuggestions（历史自动补全）zsh-syntax-highlighting（命令高亮提示）

>请注意，yay安装会放在/usr/share/zsh/plugins路径下，执行以下命令链接至用户目录下的配置文件中

```zsh
ln -sf /usr/share/zsh/plugins/zsh-autosuggestions ~/.oh-my-zsh/plugins/
ln -sf /usr/share/zsh/plugins/zsh-syntax-highlighting ~/.oh-my-zsh/plugins/
```

 然后编辑~/.zshrc文件中plugins数组使之生效

![](https://blogcdn.cyrilhub.com/blogimg/20260810230012253.avif)

```text
git zsh-autosuggestions zsh-syntax-highlighting sudo
```

其中git和sudo均为自带插件

git提供ga（git add）gl（git pull）等一系列别名。

sudo则提供输入命令后按连按Esc键快速在命令前添加sudo

配置完成后，保存输入以下命令即可生效

```zsh
source ~/.zshrc
```

#### 4.4 微信

AUR提供 [wechat](https://aur.archlinux.org/packages/wechat/)

```zsh
yay -Sy wechat
```

#### 4.5 QQ

AUR提供腾讯官方支持的Linux版本 [linuxqq](https://aur.archlinux.org/packages/linuxqq/)

```zsh
yay -Sy linuxqq
```

#### 4.6 Docker

安装命令

```zsh
yay -Sy docker docker-compose docker-buildx
```

安装完成后执行

```zsh
sudo systemctl enable --now docker
sudo docker run --rm hello-world
```

包含Hello World输出即为安装成功

运行docker若提示 **permission denied while trying to connect to the docker API at unix:///var/run/docker.sock**

请加sudo运行docker相关操作

>若希望不加sudo运行，可以将当前用户添加到docker组中

```zsh
sudo usermod -aG docker $USER
```

重启即可生效

#### 4.7 nvm（Node.js）

```zsh
yay -Sy nvm
```

安装完成如下图

![](https://blogcdn.cyrilhub.com/blogimg/20260810220120023.avif)

配置.zshrc环境变量文件

```zsh
echo 'source /usr/share/nvm/init-nvm.sh' >> ~/.zshrc
source ~/.zshrc
```

安装node（此处24为版本号，可选推荐20、22、24等LTS版本）

```zsh
nvm install 24
```

检查Node版本

```zsh
node -v && npm -v
```

输出版本号即为安装成功。

## 结语

太多软件了，包去哪里找？先去 [ArchWiki](https://wiki.archlinux.org/) 搜索，没有就看包名去 [AUR](https://aur.archlinux.org/) 上搜索。像是 cc-switch 这类 GitHub 开源的项目，在 AUR 上就叫 `cc-switch`，也有 `cc-switch-bin` 的打包版本。

## 附录：参考文档

> 文中引用链接汇总，均为官方文档、软件包仓库或项目主页，按主题分组便于查阅。

### 官方文档

- [ArchWiki](https://wiki.archlinux.org/) / [ArchWiki 中文](https://wiki.archlinuxcn.org/)

- [Arch Linux 官方安装指南（Installation guide）](https://wiki.archlinux.org/title/Installation_guide)

- [Arch Linux 官方下载页](https://archlinux.org/download/)

- [中科大镜像源（ISO 下载）](https://mirrors.ustc.edu.cn/archlinux/iso/latest/)

- [Archinstall（官方一键安装脚本）](https://wiki.archlinux.org/wiki/Archinstall)

- [Iwd / iwctl（无线网络连接）](https://wiki.archlinuxcn.org/wiki/Iwd)

- [timedatectl(1)](https://man.archlinux.org/man/timedatectl.1) / [hwclock(8)](https://man.archlinux.org/man/hwclock.8)

- [Fdisk](https://wiki.archlinux.org/title/Fdisk) / [Cfdisk](https://wiki.archlinuxcn.org/wiki/Cfdisk)

- [LVM](https://wiki.archlinux.org/title/LVM) / [RAID](https://wiki.archlinux.org/title/RAID)

- [Mirrors / Pacman 源配置](https://wiki.archlinux.org/title/Mirrors)

- [Locale / 区域设置](https://wiki.archlinux.org/title/Locale)

- [Kernel](https://wiki.archlinux.org/title/Kernel) / [Mkinitcpio](https://wiki.archlinux.org/title/Mkinitcpio)

- [Sudo](https://wiki.archlinux.org/title/Sudo)

- [GRUB（引导程序）](https://wiki.archlinux.org/title/GRUB)

- [NetworkManager / nmcli](https://wiki.archlinux.org/title/NetworkManager)

- [Arch Linux CN 仓库（archlinuxcn）](https://wiki.archlinuxcn.org/wiki/Archlinuxcn)

- [AUR（Arch 用户软件仓库）](https://aur.archlinux.org/) / [AUR helpers](https://wiki.archlinux.org/title/AUR_helpers)

- [Nouveau（开源 NVIDIA 驱动）](https://nouveau.freedesktop.org/) / [NVIDIA（闭源驱动）](https://wiki.archlinux.org/title/NVIDIA)

- [KDE（Plasma 桌面）](https://wiki.archlinux.org/title/KDE) / [SDDM（登录管理器）](https://wiki.archlinux.org/title/SDDM)

- [Fcitx5（输入法框架）](https://wiki.archlinux.org/title/Fcitx5)

- [Docker](https://wiki.archlinux.org/title/Docker) / [Docker 官方文档](https://docs.docker.com/)

### 软件与包

- [etcher（镜像写入工具）](https://etcher.balena.io/)

- [Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh) / [Oh My Zsh 插件列表](https://github.com/ohmyzsh/ohmyzsh/wiki/plugins)

- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) / [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)

- [nvm（Node.js 版本管理）](https://github.com/nvm-sh/nvm)

- [wechat（AUR）](https://aur.archlinux.org/packages/wechat/) / [linuxqq（AUR）](https://aur.archlinux.org/packages/linuxqq/)

- [v2rayn-bin（AUR）](https://aur.archlinux.org/packages/v2rayn-bin) / [clash-verge-rev-bin（AUR）](https://aur.archlinux.org/packages/clash-verge-rev-bin)

- [google-chrome（AUR）](https://aur.archlinux.org/packages/google-chrome/)

- [ttf-jetbrains-mono](https://archlinux.org/packages/?name=ttf-jetbrains-mono) / [noto-fonts](https://archlinux.org/packages/?name=noto-fonts) / [noto-fonts-cjk](https://archlinux.org/packages/?name=noto-fonts-cjk)

- [nvidia-open](https://archlinux.org/packages/?name=nvidia-open)
