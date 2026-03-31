from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    - Tout le monde peut faire GET
    - Seul admin peut POST, PUT, PATCH, DELETE
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        
        return request.user and request.user.is_staff
                                           
                                           class IsUserOrAdminReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return request.method in SAFE_METHODS
        
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return request.method in SAFE_METHODS
        
        return obj.user == request.user