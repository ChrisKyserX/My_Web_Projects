<!--
 * @FilePath: src/components/layout/AppFooter.vue
 * @Author: chiwan
 * @Date: 2026-04-09
 * @Description: 页脚组件
 * @LastEditTime: 2026-04-09
-->

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 网站信息 -->
        <div class="footer-section">
          <div class="footer-logo">
            <el-icon :size="28"><ChatDotRound /></el-icon>
            <span>Forum</span>
          </div>
          <p class="footer-desc">
            一个现代化的个人论坛社区，分享技术、交流经验、结交朋友。
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" title="GitHub">
              <el-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg></el-icon>
            </a>
            <a href="#" class="social-link" title="Twitter">
              <el-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.521 8.521 0 01-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.9 21 8.54 21c7.55 0 11.67-6.15 11.67-11.49 0-.18 0-.35-.01-.53.8-.58 1.49-1.3 2.04-2.13z"/></svg></el-icon>
            </a>
            <a href="#" class="social-link" title="Email">
              <el-icon><Message /></el-icon>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="footer-section">
          <h4 class="footer-title">快速链接</h4>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/categories">分类</router-link></li>
            <li><router-link to="/tags">标签</router-link></li>
            <li><router-link to="/ranking">排行榜</router-link></li>
          </ul>
        </div>

        <!-- 关于我们 -->
        <div class="footer-section">
          <h4 class="footer-title">关于我们</h4>
          <ul class="footer-links">
            <li><a href="#">关于论坛</a></li>
            <li><a href="#">使用指南</a></li>
            <li><a href="#">社区规范</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>

        <!-- 友情链接 -->
        <div class="footer-section">
          <h4 class="footer-title">友情链接</h4>
          <ul class="footer-links">
            <li><a href="https://github.com" target="_blank">GitHub</a></li>
            <li><a href="https://stackoverflow.com" target="_blank">Stack Overflow</a></li>
            <li><a href="https://vuejs.org" target="_blank">Vue.js</a></li>
            <li><a href="https://element-plus.org" target="_blank">Element Plus</a></li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="footer-bottom">
        <p>&copy; 2026 Forum. All rights reserved.</p>
        <p>
          <a href="#">隐私政策</a>
          <span class="divider">|</span>
          <a href="#">服务条款</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ChatDotRound, Message } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.app-footer {
  background: var(--bg-overlay);
  border-top: 1px solid var(--border-light);
  padding: 48px 0 24px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.footer-section {
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 16px;
    
    .el-icon {
      color: var(--primary-color);
    }
  }
  
  .footer-desc {
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .footer-social {
    display: flex;
    gap: 12px;
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-page);
      color: var(--text-secondary);
      transition: all 0.3s ease;
      
      &:hover {
        color: var(--primary-color);
        background: var(--primary-light);
        transform: translateY(-2px);
      }
      
      .el-icon {
        font-size: 18px;
      }
    }
  }
  
  .footer-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 16px;
  }
  
  .footer-links {
    list-style: none;
    
    li {
      margin-bottom: 10px;
      
      a {
        color: var(--text-secondary);
        font-size: 14px;
        transition: color 0.3s ease;
        
        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--border-lighter);
  font-size: 13px;
  color: var(--text-secondary);
  
  a {
    color: var(--text-secondary);
    
    &:hover {
      color: var(--primary-color);
    }
  }
  
  .divider {
    margin: 0 12px;
    color: var(--border-base);
  }
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 576px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
