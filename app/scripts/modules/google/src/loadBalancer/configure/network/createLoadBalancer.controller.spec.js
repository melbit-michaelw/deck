'use strict';

import { APPLICATION_MODEL_BUILDER } from '@spinnaker/core';

describe('Controller: gceCreateLoadBalancerCtrl', function() {
  const angular = require('angular');

  // load the controller's module
  beforeEach(function() {
    window.module(require('./createLoadBalancer.controller.js').name, APPLICATION_MODEL_BUILDER);
  });

  // Initialize the controller and a mock scope
  beforeEach(
    window.inject(function($controller, $rootScope, _v2modalWizardService_, applicationModelBuilder) {
      this.$scope = $rootScope.$new();
      const app = applicationModelBuilder.createApplication('app', { key: 'loadBalancers', lazy: true });
      this.ctrl = $controller('gceCreateLoadBalancerCtrl', {
        $scope: this.$scope,
        $uibModalInstance: { dismiss: angular.noop, result: { then: angular.noop } },
        application: app,
        loadBalancer: null,
        isNew: true,
      });
      this.wizardService = _v2modalWizardService_;
    }),
  );

  it('requires health check path for HTTP/S', function() {
    var loadBalancer = {
      healthCheckProtocol: 'HTTP',
    };

    this.$scope.loadBalancer = loadBalancer;

    expect(this.ctrl.requiresHealthCheckPath()).toBe(true);

    loadBalancer.healthCheckProtocol = 'HTTPS';
    expect(this.ctrl.requiresHealthCheckPath()).toBe(true);

    loadBalancer.healthCheckProtocol = 'SSL';
    expect(this.ctrl.requiresHealthCheckPath()).toBe(false);

    loadBalancer.healthCheckProtocol = 'TCP';
    expect(this.ctrl.requiresHealthCheckPath()).toBe(false);
  });

  it('should update name', function() {
    var lb = this.$scope.loadBalancer;
    expect(lb).toBeDefined();
    expect(lb.name).toBeUndefined();

    this.ctrl.updateName();
    expect(lb.name).toBe('app');

    this.$scope.loadBalancer.stack = 'testStack';
    this.ctrl.updateName();
    expect(lb.name).toBe('app-testStack');
  });

  it('should make the health check tab invisible then visible again', function() {
    spyOn(this.wizardService, 'includePage');
    spyOn(this.wizardService, 'markIncomplete');
    spyOn(this.wizardService, 'excludePage');
    spyOn(this.wizardService, 'markComplete');
    this.$scope.loadBalancer.listeners[0].healthCheck = false;
    this.ctrl.setVisibilityHealthCheckTab();
    expect(this.wizardService.excludePage.calls.count()).toEqual(2);

    this.$scope.loadBalancer.listeners[0].healthCheck = true;
    this.ctrl.setVisibilityHealthCheckTab();
    expect(this.wizardService.includePage.calls.count()).toEqual(2);
  });
});
