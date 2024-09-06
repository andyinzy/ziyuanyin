import Script from 'next/script'
import { useConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils';
import {useEffect} from 'react'

const Scripts = () => {
  const BLOG = useConfig()
  useEffect(() => {
    // 懒加载 CSS 文件
    loadExternalResource('https://example.com/styles.css', 'css')
      .then(() => console.log('CSS loaded'))
      .catch(err => console.error('Error loading CSS:', err));

    // 懒加载外部 JS 文件
    loadExternalResource('https://example.com/extra-script.js', 'js')
      .then(() => console.log('JS script loaded'))
      .catch(err => console.error('Error loading JS:', err));

    // 懒加载字体
    loadExternalResource('https://example.com/font.css', 'font')
      .then(() => console.log('Font loaded'))
      .catch(err => console.error('Error loading font:', err));
  }, []); // 空数组表示只在组件挂载时运行一次
  return (
    <>
      {BLOG.analytics && BLOG.analytics.provider === 'ackee' && (
        <Script
          src={BLOG.analytics.ackeeConfig.tracker}
          data-ackee-server={BLOG.analytics.ackeeConfig.dataAckeeServer}
          data-ackee-domain-id={BLOG.analytics.ackeeConfig.domainId}
        />
      )}
      {BLOG.analytics && BLOG.analytics.provider === 'ga' && (
        <>
          {/* 懒加载 Google Analytics */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.analytics.gaConfig.measurementId}`}
          />
          <Script strategy="lazyOnload" id="ga">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${BLOG.analytics.gaConfig.measurementId}', {
                page_path: window.location.pathname,
              });`}
          </Script>
        </>
      )}
    </>
  )
}

export default Scripts
