import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { forkJoin } from 'rxjs';

import { ApiService } from '../../services/api.service';

import { SeoService } from '../../services/seo.service';

import { Router } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent implements OnInit, AfterViewInit, OnDestroy {
  // =====================================================
  // PAGE DATA
  // =====================================================

  page: any = null;
  mapUrl: SafeResourceUrl | null = null;

  // =====================================================
  // SETTINGS
  // =====================================================

  settings: any = {};

  // =====================================================
  // CONTACT FORM
  // =====================================================

  contactForm!: FormGroup;

  isSubmitting: boolean = false;

  formSuccessMessage: string = '';

  formErrorMessage: string = '';

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  isLoading: boolean = true;

  errorMessage: string = '';

  // =====================================================
  // SCROLL REVEAL
  // =====================================================

  private observer?: IntersectionObserver;

  private viewReady: boolean = false;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private apiService: ApiService,
    private seoService: SeoService,
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {
    this.createContactForm();
  }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadPage();
  }

  // =====================================================
  // VIEW READY
  // =====================================================

  ngAfterViewInit(): void {
    this.viewReady = true;
  }

  // =====================================================
  // CREATE CONTACT FORM
  // =====================================================

  private createContactForm(): void {
    this.contactForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(100)]],

      last_name: ['', [Validators.required, Validators.maxLength(100)]],

      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(190)],
      ],

      phone: ['', [Validators.required, Validators.maxLength(30)]],

      subject: ['', [Validators.required, Validators.maxLength(255)]],

      message: ['', [Validators.required, Validators.maxLength(5000)]],
    });
  }

  // =====================================================
  // LOAD PAGE + SETTINGS
  // =====================================================

  loadPage(): void {
    this.isLoading = true;

    this.errorMessage = '';

    forkJoin({
      page: this.apiService.get('pages/contact-us'),

      settings: this.apiService.get('settings'),
    }).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // =================================================
        // PAGE RESPONSE
        // =================================================

        if (response?.page?.status !== 'success') {
          this.errorMessage = response?.page?.message || 'Unable to load page.';

          return;
        }

        this.page = response?.page?.data || null;

        if (!this.page) {
          this.errorMessage = 'Unable to load page.';

          return;
        }

        // =================================================
        // SETTINGS RESPONSE
        // =================================================

        if (response?.settings?.status === 'success') {
          this.settings = response?.settings?.data || {};

          // Google Maps iframe URL
          if (this.settings?.google_maps_embed_url) {
            this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.settings.google_maps_embed_url,
            );
          } else {
            this.mapUrl = null;
          }
        }

        // =================================================
        // SEO
        // =================================================

        this.setSeo();

        // =================================================
        // SCROLL REVEAL
        // =================================================

        setTimeout(() => {
          this.initScrollReveal();
        }, 50);
      },

      error: (error: any) => {
        console.error('Contact page error:', error);

        this.isLoading = false;

        this.errorMessage = error?.error?.message || 'Unable to load page.';
      },
    });
  }

  // =====================================================
  // SUBMIT CONTACT FORM
  // =====================================================

  submitContactForm(): void {
    this.formSuccessMessage = '';

    this.formErrorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();

      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const payload = {
      first_name: this.contactForm.value.first_name?.trim(),

      last_name: this.contactForm.value.last_name?.trim(),

      email: this.contactForm.value.email?.trim(),

      phone: this.contactForm.value.phone?.trim(),

      subject: this.contactForm.value.subject?.trim(),

      message: this.contactForm.value.message?.trim(),
    };

    this.apiService.post('contact', payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;

        if (response?.status === 'success') {
          this.contactForm.reset();

          this.router.navigate(['/thank-you']);
        } else {
          this.formErrorMessage =
            response?.message ||
            'Unable to send your message. Please try again.';
        }
      },

      error: (error: any) => {
        console.error('Contact form error:', error);

        this.isSubmitting = false;

        this.formErrorMessage =
          error?.error?.message ||
          'Unable to send your message. Please try again.';
      },
    });
  }

  // =====================================================
  // FIELD INVALID
  // =====================================================

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);

    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // =====================================================
  // PHONE LINK
  // =====================================================

  getPhoneLink(phone: string): string {
    if (!phone) {
      return '';
    }

    return 'tel:' + phone.replace(/[^0-9+]/g, '');
  }

  // =====================================================
  // EMAIL LINK
  // =====================================================

  getEmailLink(email: string): string {
    if (!email) {
      return '';
    }

    return 'mailto:' + email;
  }

  // =====================================================
  // SEO
  // =====================================================

  private setSeo(): void {
    if (!this.page) {
      return;
    }

    const siteName = this.settings?.site_name || '';

    this.seoService.update({
      title: this.page.meta_title || this.page.title || siteName,

      description:
        this.page.meta_description || this.page.short_description || '',

      keywords: this.page.meta_keywords || '',

      canonical: this.page.canonical_url || '',

      siteName: siteName,

      robots: 'index, follow',

      type: 'website',
    });
  }

  // =====================================================
  // SCROLL REVEAL
  // =====================================================

  private initScrollReveal(): void {
    if (!this.viewReady) {
      setTimeout(() => {
        this.initScrollReveal();
      }, 50);

      return;
    }

    if (this.observer) {
      this.observer.disconnect();
    }

    const root: HTMLElement = this.elementRef.nativeElement;

    const elements = root.querySelectorAll('.med-scroll-reveal');

    if (!elements.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element: Element) => {
        element.classList.add('med-visible');
      });

      return;
    }

    root.classList.add('med-reveal-ready');

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('med-visible');

            this.observer?.unobserve(entry.target);
          }
        });
      },

      {
        threshold: 0.12,

        rootMargin: '0px 0px -45px 0px',
      },
    );

    elements.forEach((element: Element) => {
      this.observer?.observe(element);
    });
  }

  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
