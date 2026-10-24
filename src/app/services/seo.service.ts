import {
  Inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  DOCUMENT
} from '@angular/core';



import {
    Meta,
    Title
} from '@angular/platform-browser';


export interface SeoData {

    title?: string;

    description?: string;

    keywords?: string;

    canonical?: string;

    robots?: string;

    image?: string;

    type?: string;

    siteName?: string;

}


@Injectable({
    providedIn: 'root'
})
export class SeoService {

    private renderer: Renderer2;


    constructor(
        private titleService: Title,
        private metaService: Meta,
        rendererFactory: RendererFactory2,

        @Inject(DOCUMENT)
        private document: Document
    ) {

        this.renderer =
            rendererFactory.createRenderer(
                null,
                null
            );

    }


    // =========================================================
    // UPDATE SEO
    // =========================================================

    update(data: SeoData): void {

        const title =
            data.title || '';

        const description =
            data.description || '';

        const keywords =
            data.keywords || '';

        const canonical =
            data.canonical || '';

        const robots =
            data.robots || 'index, follow';

        const siteName =
            data.siteName || '';


        // =====================================================
        // TITLE
        // =====================================================

        if (title) {

            this.titleService.setTitle(
                title
            );

        }


        // =====================================================
        // DESCRIPTION
        // =====================================================

        if (description) {

            this.metaService.updateTag({
                name: 'description',
                content: description
            });

        } else {

            this.metaService.removeTag(
                'name="description"'
            );

        }


        // =====================================================
        // KEYWORDS
        // =====================================================

        if (keywords) {

            this.metaService.updateTag({
                name: 'keywords',
                content: keywords
            });

        } else {

            this.metaService.removeTag(
                'name="keywords"'
            );

        }


        // =====================================================
        // ROBOTS
        // =====================================================

        this.metaService.updateTag({
            name: 'robots',
            content: robots
        });


        // =====================================================
        // OPEN GRAPH TITLE
        // =====================================================

        if (title) {

            this.metaService.updateTag({
                property: 'og:title',
                content: title
            });

        } else {

            this.metaService.removeTag(
                'property="og:title"'
            );

        }


        // =====================================================
        // OPEN GRAPH DESCRIPTION
        // =====================================================

        if (description) {

            this.metaService.updateTag({
                property: 'og:description',
                content: description
            });

        } else {

            this.metaService.removeTag(
                'property="og:description"'
            );

        }


        // =====================================================
        // OPEN GRAPH TYPE
        // =====================================================

        this.metaService.updateTag({
            property: 'og:type',
            content: data.type || 'website'
        });


        // =====================================================
        // OPEN GRAPH SITE NAME
        // =====================================================

        if (siteName) {

            this.metaService.updateTag({
                property: 'og:site_name',
                content: siteName
            });

        } else {

            this.metaService.removeTag(
                'property="og:site_name"'
            );

        }


        // =====================================================
        // OPEN GRAPH URL
        // =====================================================

        if (canonical) {

            this.metaService.updateTag({
                property: 'og:url',
                content: canonical
            });

        } else {

            this.metaService.removeTag(
                'property="og:url"'
            );

        }


        // =====================================================
        // OPEN GRAPH IMAGE
        // =====================================================

        if (data.image) {

            this.metaService.updateTag({
                property: 'og:image',
                content: data.image
            });

        } else {

            this.metaService.removeTag(
                'property="og:image"'
            );

        }


        // =====================================================
        // TWITTER CARD
        // =====================================================

        this.metaService.updateTag({
            name: 'twitter:card',
            content: data.image
                ? 'summary_large_image'
                : 'summary'
        });


        // =====================================================
        // TWITTER TITLE
        // =====================================================

        if (title) {

            this.metaService.updateTag({
                name: 'twitter:title',
                content: title
            });

        } else {

            this.metaService.removeTag(
                'name="twitter:title"'
            );

        }


        // =====================================================
        // TWITTER DESCRIPTION
        // =====================================================

        if (description) {

            this.metaService.updateTag({
                name: 'twitter:description',
                content: description
            });

        } else {

            this.metaService.removeTag(
                'name="twitter:description"'
            );

        }


        // =====================================================
        // TWITTER IMAGE
        // =====================================================

        if (data.image) {

            this.metaService.updateTag({
                name: 'twitter:image',
                content: data.image
            });

        } else {

            this.metaService.removeTag(
                'name="twitter:image"'
            );

        }


        // =====================================================
        // CANONICAL
        // =====================================================

        this.setCanonical(
            canonical
        );

    }


    // =========================================================
// SET CANONICAL URL
// =========================================================

private setCanonical(url: string): void {

    // Remove existing canonical
    const existingCanonical =
        this.document.head.querySelector(
            'link[rel="canonical"]'
        );

    if (existingCanonical) {
        existingCanonical.remove();
    }

    // Nothing to add
    if (!url || !url.trim()) {
        return;
    }

    // Create canonical
    const link: HTMLLinkElement =
        this.document.createElement('link');

    link.setAttribute(
        'rel',
        'canonical'
    );

    link.setAttribute(
        'href',
        url.trim()
    );

    this.document.head.appendChild(link);
}

}
