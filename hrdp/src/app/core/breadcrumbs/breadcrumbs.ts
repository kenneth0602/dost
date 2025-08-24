import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, Location } from '@angular/common';

// Angular Material
import { MatIconModule } from '@angular/material/icon';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss'
})
export class Breadcrumbs {

  public breadcrumbs: IBreadCrumb[];
  public showBackButton: boolean = true;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit(): void {
    this.updateBreadcrumbs();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
        this.updateBreadcrumbs();
      });
  }

  private buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadCrumb[] = []
  ): IBreadCrumb[] {
    const label = this.getLabel(route);
    const path = this.getPath(route);

    const lastRoutePart = this.getLastRoutePart(path);
    const isDynamicRoute = this.isDynamicRoute(lastRoutePart);

    if (isDynamicRoute && route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      url = this.replaceDynamicRoute(url, path, paramName, route.snapshot.params[paramName]);
    } else {
      url = this.getNextUrl(url, path);
    }

    const breadcrumb: IBreadCrumb = {
      label: label,
      url: url
    };

    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];

    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, url, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }

  private getLabel(route: ActivatedRoute): string {
    return route.routeConfig?.data?.['breadcrumb'] || '';
  }

  private getPath(route: ActivatedRoute): string {
    return route.routeConfig?.path || '';
  }

  private getLastRoutePart(path: string): string {
    return path.split('/').pop() || '';
  }

  private isDynamicRoute(lastRoutePart: string): boolean {
    return lastRoutePart.startsWith(':');
  }

  private replaceDynamicRoute(url: string, path: string, paramName: string, paramValue: string): string {
    return url.replace(path, paramValue);
  }

  private getNextUrl(url: string, path: string): string {
    return path ? `${url}/${path}` : url;
  }

  goBack(): void {
    this.location.back();
  }

  private updateBreadcrumbs(): void {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    const currentUrl = this.router.url;
    this.showBackButton = !currentUrl.includes('/supervisor/library');
  }

}
